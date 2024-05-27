const express = require('express')
require('express-async-errors')
const config = require('./config')
const routes = require('./routes')
const { end: endDb, test: testDb } = require('./db/connection')
const db = require('./db')

const app = express()

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

app.use(async (req, res, next) => {
  const dbIsUp = await testDb()
  if (!dbIsUp) {
    next(new Error('Database connection is down'))
  }
  req.db = db
  next()
})

app.use(routes)

app.all('*', (req, res) => {
  res.status(404)
  res.send(`${req.method} ${req.path} does not exist`)
})

app.use((err, req, res, next) => {
  const message = err.message || 'unknown error'
  console.error(`Error: ${message}`, err)
  res.status(500)
  res.send(message)
})

console.log('starting server')
const server = app.listen(config.SERVER_PORT, () => {
  console.log(`listening on port ${config.SERVER_PORT}`)
})

function shutdown() {
  console.log('shutting down')
  server.close(() => {
    console.log('closed server')
    endDb()
    process.exit(0)
  })

  setTimeout(() => {
    console.error('could not shut down in time')
    process.exit(1)
  }, 5000)
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
