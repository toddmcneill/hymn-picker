const { query } = require('./connection')
const { randomUUID } = require('crypto')

async function getAccounts() {
  const rows = await query('SELECT * FROM account')
  return rows.map(accountToApi)
}

async function getAccountById(id) {
  const rows = await query('SELECT * FROM account WHERE id = $1', [id])
  return rows[0] ? accountToApi(rows[0]) : null
}

async function createAccount(handle, name, id = randomUUID()) {
  await query(
    'INSERT INTO account (id, handle, name) VALUES ($1, $2, $3)',
    [id, handle, name]
  )
  return id
}

function accountToApi(row) {
  return {
    id: row.id,
    handle: row.handle,
    name: row.name,
  }
}

module.exports = {
  getAccounts,
  getAccountById,
  createAccount,
}
