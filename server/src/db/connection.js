const pg = require('pg')
const config = require('../config')

const pool = new pg.Pool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_DATABASE,
  user: config.DB_USER,
  password: config.DB_PASSWORD
})

async function query(text, values) {
  const result = await pool.query(text, values)
  return result.rows
}

async function test() {
  return query('SELECT 1').then(() => true).catch(err => false)
}

function end() {
  pool.end()
}

module.exports = {
  query,
  test,
  end,
}
