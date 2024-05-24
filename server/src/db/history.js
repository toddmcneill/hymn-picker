const { query } = require('./connection')

async function getHistoryByUserId(userId) {
  const rows = await query('SELECT * FROM history WHERE userId = $1', [userId])
  return rows.map(historyToApi)
}

function historyToApi(history) {
  return {
    id: history.id,
    userId: history.userId,
    year: history.year,
    week: history.week,
  }
}

module.exports = {
  getHistoryByUserId,
}
