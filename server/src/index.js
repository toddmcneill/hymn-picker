const fs = require('fs')
const path = require('path')
const csv = require('csvtojson')

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

async function pickHymns() {
  const hymnData = await loadHymnData()
  const history = await loadHistory()
  const pickedHymns = pickHymnsForWeek(hymnData, history, 1)
  return formatPickedHymns(pickedHymns)
}

module.exports = {
  pickHymns
}
