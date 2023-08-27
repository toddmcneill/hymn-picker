const { pickHymns, formatPickedHymnsForSheet, formatPickedHymnsForCSV } = require('./index')

pickHymns().then(pickedHymns => {
  const formattedForSheet = formatPickedHymnsForSheet(pickedHymns)
  const formattedForCsv = formatPickedHymnsForCSV(pickedHymns)
  console.log()
  console.log(formattedForSheet)
  console.log()
  console.log(formattedForCsv)
  console.log()
})
