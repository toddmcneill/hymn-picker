const dbConnection = require('../../src/db/connection')
const db = require('../../src/db')

const ACCOUNT_ID = '7339bcf3-a99e-4d5b-99d5-39ae76f17cd6'

async function seedAccount() {
  await dbConnection.query('DELETE FROM account WHERE id = $1', [ACCOUNT_ID])
  await db.createAccount('testuser', 'Test User', ACCOUNT_ID)
}

console.time('seed account')
seedAccount().then(() => {
  console.timeEnd('seed account')
  dbConnection.end()
}).catch(err => console.log(err.message))
