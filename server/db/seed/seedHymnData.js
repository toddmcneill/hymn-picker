const csv = require('csvtojson')
const fs = require('fs')
const path = require('path')
const { randomUUID } = require('crypto')
const dbConnection = require('../../src/db/connection')

async function seedHymnData() {
  await dbConnection.query('TRUNCATE TABLE hymn')
  const filePath = path.join(__dirname, '..', '..', 'data', 'hymnData.csv')
  const fileData = await csv().fromFile(filePath)
  await Promise.all(fileData.map(fromCsv).map(toSql))
}

function fromCsv(row) {
  return {
    hymnNumber: parseInt(row.Number, 10),
    title: row.Title,
    mood: row.Mood,
    hymnLength: parseInt(row.Length, 10),
    familiarity: parseInt(row.Familiarity, 10),
    isLimited: !!row.Limited,
    isEaster: !!row.Easter,
    isPatriotic: !!row.Patriotic,
    isPioneer: !!row.Pioneer,
    isThanksgiving: !!row.Thanksgiving,
    isChristmas: !!row.Christmas,
    isNewYear: !!row.NewYear,
    isSacrament: !!row.Sacrament,
    isFasting: !!row.Fasting,
    isClosing: !!row.Closing,
    isDismiss: !!row.Dismiss,
  }
}

function toSql(hymn) {
  const query = `
    INSERT INTO hymn (
      id, number, title, mood, length, familiarity, limited, easter, patriotic, pioneer, thanksgiving, christmas, newyear, sacrament, fasting, closing, dismiss
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
    )
  `
  const values = [randomUUID(), hymn.hymnNumber, hymn.title, hymn.mood, hymn.hymnLength, hymn.familiarity, hymn.isLimited, hymn.isEaster, hymn.isPatriotic, hymn.isPioneer, hymn.isThanksgiving, hymn.isChristmas, hymn.isNewYear, hymn.isSacrament, hymn.isFasting, hymn.isClosing, hymn.isDismiss]

  return dbConnection.query(query, values)
}

console.time('seed hymn data')
seedHymnData().then(() => {
  console.timeEnd('seed hymn data')
  dbConnection.end()
}).catch(err => console.log(err.message))
