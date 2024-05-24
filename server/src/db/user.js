const { query } = require('./connection')

async function getUsers() {
  const rows = await query('SELECT * FROM user')
  return rows.map(userToApi)
}

async function getUserById(id) {
  const rows = await query('SELECT * FROM user WHERE id = $1', [id])
  return rows[0] ? userToApi(rows[0]) : null
}

function userToApi(user) {
  return {
    id: user.id,
    handle: user.handle,
    name: user.name,
  }
}

module.exports = {
  getUsers,
  getUserById,
}
