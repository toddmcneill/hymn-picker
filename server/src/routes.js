const express = require('express')

const router = express.Router()

router.get('/accounts', async (req, res) => {
  const accounts = await req.db.getAccounts()
  res.send(accounts)
})

router.get('/account/:id', async (req, res) => {
  const account = await req.db.getAccountById(req.params.id)
  res.send(account)
})

router.get('/hymns', async (req, res) => {
  const hymns = await req.db.getHymns()
  res.send(hymns)
})

module.exports = router
