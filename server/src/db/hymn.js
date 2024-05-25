const { query } = require('./connection')

async function getHymns() {
  const rows = await query('SELECT * FROM hymn')
  return rows.map(hymnToApi)
}

async function getHymnsByHistoryId(id) {
  const rows = await query('SELECT hymn.*, hymn_history.purpose FROM hymn JOIN hymn_history ON hymn.id = hymn_history.hymn_id WHERE hymn_history.history_id = $1', [id])
  return rows.map(row => ({...hymnToApi(row), purpose: row.purpose }))
}

function hymnToApi(row) {
  return {
    id: row.id,
    number: row.number,
    title: row.title,
    mood: row.mood,
    length: row.length,
    familiarity: row.familiarity,
    isLimited: row.limited,
    limitedUses: {
      easter: row.easter,
      patriotic: row.patriotic,
      pioneer: row.pioneer,
      thanksgiving: row.thanksgiving,
      christmas: row.christmas,
      newyear: row.newyear,
      sacrament: row.sacrament,
      fasting: row.fasting,
      closing: row.closing,
      dismiss: row.dismiss,
    },
  }
}

module.exports = {
  getHymns,
  getHymnsByHistoryId,
}
