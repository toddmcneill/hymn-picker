const fs = require('fs')
const path = require('path')
const csv = require('csvtojson')
const dateFns = require('date-fns')

const { pickHymnsForWeek } = require('./picker')
const { mapHymnData, mapHistory, sortHistory } = require('./parseInput')

async function loadHymnData() {
  const filePath = path.join(__dirname, '..', 'data', 'hymnData.csv')
  const fileData = await csv().fromFile(filePath)
  return fileData.map(mapHymnData).sort((a, b) => a.hash < b.hash ? -1 : 1)
}

async function loadHistory() {
  const filePath = path.join(__dirname, '..', 'data', 'history.csv')
  const fileData = await csv().fromFile(filePath)
  return fileData.map(mapHistory).sort((a, b) => a.week < b.week ? -1 : 1)
}

function formatPickedHymns(pickedHymns) {
  return {
    opening: `${pickedHymns.opening.hymnNumber} - ${pickedHymns.opening.title}`,
    sacrament: `${pickedHymns.sacrament.hymnNumber} - ${pickedHymns.sacrament.title}`,
    intermediate: `${pickedHymns.intermediate.hymnNumber} - ${pickedHymns.intermediate.title}`,
    closing: `${pickedHymns.closing.hymnNumber} - ${pickedHymns.closing.title}`,
    dismiss: `${pickedHymns.dismiss.hymnNumber} - ${pickedHymns.dismiss.title}`,
  }
}

function formatPickedHymnsForSheet(pickedHymns) {
  return [
    `${pickedHymns.opening.hymnNumber} - ${pickedHymns.opening.title}`,
    `${pickedHymns.sacrament.hymnNumber} - ${pickedHymns.sacrament.title}`,
    `${pickedHymns.intermediate.hymnNumber} - ${pickedHymns.intermediate.title}`,
    `${pickedHymns.closing.hymnNumber} - ${pickedHymns.closing.title}`,
    `${pickedHymns.dismiss.hymnNumber} - ${pickedHymns.dismiss.title}`,
  ].join('\n')
}

function getNextSundayFormattedDate(weeksOut = 1) {
  const nextSunday = dateFns.startOfWeek(dateFns.addDays(new Date(), weeksOut * 7))
  return dateFns.format(nextSunday, 'yyyy-MM-dd')
}

function formatPickedHymnsForCSV(pickedHymns) {
  const nextSundayFormattedDate = getNextSundayFormattedDate()
  return [
    `${nextSundayFormattedDate},${pickedHymns.opening.hymnNumber},O`,
    `${nextSundayFormattedDate},${pickedHymns.sacrament.hymnNumber},S`,
    `${nextSundayFormattedDate},${pickedHymns.intermediate.hymnNumber},I`,
    `${nextSundayFormattedDate},${pickedHymns.closing.hymnNumber},C`,
    `${nextSundayFormattedDate},${pickedHymns.dismiss.hymnNumber},D`,
  ].join('\n')
}

async function pickHymns() {
  const hymnData = await loadHymnData()
  const history = await loadHistory()
  return pickHymnsForWeek(hymnData, history, 1)
}

module.exports = {
  pickHymns,
  formatPickedHymnsForSheet,
  formatPickedHymnsForCSV
}
