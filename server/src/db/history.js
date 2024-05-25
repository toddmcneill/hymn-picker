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
  const rows = await query('SELECT * FROM history WHERE account_id = $1', [accountId])
  return rows.map(historyToApi)
}

async function getHistoryById(id) {
  const rows = await query('SELECT * FROM history WHERE id = $1', [id])
  return rows[0] ? historyToApi(rows[0]) : null
}

function historyToApi(row) {
  return {
    id: row.id,
    accountId: row.account_id,
    year: row.year,
    week: row.week,
  }
}

module.exports = {
  createHistory,
  createHymnHistory,
  getHistoryByAccountId,
  getHistoryById,
}
