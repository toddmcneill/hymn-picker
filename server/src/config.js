const path = require('path')
require('dotenv-safe').config({
  path: path.join(__dirname, '.env'),
  example: path.join(__dirname, '.example.env')
})

module.exports = {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  SERVER_PORT: process.env.SERVER_PORT,
}
