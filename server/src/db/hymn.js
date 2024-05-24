const { query } = require('./connection')

async function getHymns() {
  const rows = await query('SELECT * FROM hymn')
  return rows.map(hymnToApi)
}

function hymnToApi(hymn) {
  return {
    id: hymn.id,
    number: hymn.number,
    title: hymn.title,
    mood: hymn.mood,
    length: hymn.length,
    familiarity: hymn.familiarity,
    isLimited: hymn.limited,
    limitedUses: {
      easter: hymn.easter,
      patriotic: hymn.patriotic,
      pioneer: hymn.pioneer,
      thanksgiving: hymn.thanksgiving,
      christmas: hymn.christmas,
      newyear: hymn.newyear,
      sacrament: hymn.sacrament,
      fasting: hymn.fasting,
      closing: hymn.closing,
      dismiss: hymn.dismiss,
    },
  }
}

module.exports = {
  getHymns,
}
