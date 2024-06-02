const csv = require('csvtojson')
const path = require('path')
const dateFns = require('date-fns')
const dbConnection = require('../../src/db/connection')
const db = require('../../src/db')
const { getYearAndWeek } = require('../../src/util')
const { HymnTypes } = require('../../src/enums')

const ACCOUNT_ID = '7339bcf3-a99e-4d5b-99d5-39ae76f17cd6'

async function seedHistory() {
  const existingHistory = await db.getHistoryByAccountId(ACCOUNT_ID)
  const existingHistoryIds = existingHistory.map(history => history.id)
  await dbConnection.query('DELETE FROM hymn_history WHERE history_id = ANY($1)', [existingHistoryIds])
  await dbConnection.query('DELETE FROM history WHERE account_id = $1', [ACCOUNT_ID])

  const filePath = path.join(__dirname, '..', '..', 'data', 'history.csv')
  const fileData = await csv().fromFile(filePath)
  const historyList = fileData.map(fromCsv)
  const uniqueWeeks = historyList.reduce((acc, cur) => {
    if (!acc.find(accItem => accItem.year === cur.year && accItem.week === cur.week)) {
      acc.push(cur)
    }
    return acc
  }, [])
  
  const newHistoryIds = await Promise.all(uniqueWeeks.map(({ week, year }) => db.createHistory(ACCOUNT_ID, year, week)))
  
  const hymns = await db.getHymns()
  const hymnsByNumber = hymns.reduce((acc, cur) => ({...acc, [cur.number]: cur}), {})
  
  await Promise.all(historyList.map(({ year, week, hymnNumber, purpose }) => {
    const hymnId = hymnsByNumber[hymnNumber].id

    const historyId = newHistoryIds[uniqueWeeks.findIndex(uniqueWeek => uniqueWeek.year === year && uniqueWeek.week === week)]

    return db.createHymnHistory(hymnId, historyId, purpose)
  }))
}

function fromCsv(row) {
  const date = dateFns.parseISO(row.Date)
  const { year, week } = getYearAndWeek(date)

  return {
    year,
    week,
    hymnNumber: parseInt(row.Number, 10),
    purpose: mapLetterToHymnType(row.HymnType)
  }
}

function mapLetterToHymnType(letter) {
  switch (letter) {
    case 'O': return HymnTypes.Opening
    case 'S': return HymnTypes.Sacrament
    case 'I': return HymnTypes.Intermediate
    case 'C': return HymnTypes.Closing
    case 'D': return HymnTypes.Dismiss
    default: return HymnTypes.Unknown
  }
}

console.time('seed history')
seedHistory().then(() => {
  console.timeEnd('seed history')
  dbConnection.end()
}).catch(err => console.log(err.message))
