const { query } = require('./connection')

async function getHistoryByAccountId(accountId) {
  const rows = await query('SELECT * FROM history WHERE account_id = $1', [accountId])
  return rows.map(historyToApi)
}

function historyToApi(history) {
  return {
    id: history.id,
    accountId: history.account_id,
    year: history.year,
    week: history.week,
  }
}

module.exports = {
  getHistoryByAccountId,
}
