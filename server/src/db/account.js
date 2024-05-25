const { query } = require('./connection')

async function getAccounts() {
  const rows = await query('SELECT * FROM account')
  return rows.map(accountToApi)
}

async function getAccountById(id) {
  const rows = await query('SELECT * FROM account WHERE id = $1', [id])
  return rows[0] ? accountToApi(rows[0]) : null
}

function accountToApi(account) {
  return {
    id: account.id,
    handle: account.handle,
    name: account.name,
  }
}

module.exports = {
  getAccounts,
  getAccountById,
}
