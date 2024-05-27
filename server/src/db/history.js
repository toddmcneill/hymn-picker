const { query } = require('./connection')
const { randomUUID } = require('crypto')

async function createHistory(accountId, year, week) {
  const id = randomUUID()
  await query(
    'INSERT INTO history (id, account_id, year, week) VALUES ($1, $2, $3, $4)',
    [id, accountId, year, week]
  )
  return id
}

async function createHymnHistory(hymnId, historyId, purpose) {
  const id = randomUUID()
  await query(
    'INSERT INTO hymn_history (id, hymn_id, history_id, purpose) VALUES ($1, $2, $3, $4)',
    [id, hymnId, historyId, purpose]
  )
  return id
}

async function getHistoryByAccountId(accountId) {
  const rows = await query(
    'SELECT * FROM history WHERE account_id = $1 ORDER BY year DESC, week DESC',
    [accountId]
  )
  return rows.map(historyToApi)
}

async function getHymnHistoryByAccountId(accountId) {
  const rows = await query(`
    SELECT hymn_history.*, history.year, history.week
    FROM history
    JOIN hymn_history
      ON hymn_history.history_id = history.id
    WHERE account_id = $1
    ORDER BY year DESC, week DESC
  `, [accountId]
  )
  return rows.map(hymnHistoryToApi)
}

function historyToApi(row) {
  return {
    id: row.id,
    accountId: row.account_id,
    year: row.year,
    week: row.week,
  }
}

function hymnHistoryToApi(row) {
  return {
    id: row.id,
    historyId: row.history_id,
    year: row.year,
    week: row.week,
    hymnId: row.hymn_id,
    purpose: row.purpose,
  }
}

module.exports = {
  createHistory,
  createHymnHistory,
  getHistoryByAccountId,
  getHymnHistoryByAccountId,
}
