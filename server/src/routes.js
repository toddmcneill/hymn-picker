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

router.get('/history', async (req, res) => {
  const accountId = '7339bcf3-a99e-4d5b-99d5-39ae76f17cd6' // TODO: pull from auth
  const history = await req.db.getHistoryByAccountId(accountId)
  res.send(history)
})

router.get('/hymns/history/:id', async (req, res) => {
  const hymns = await req.db.getHymnsByHistoryId(req.params.id)
  res.send(hymns)
})

router.get('/hymns', async (req, res) => {
  const hymns = await req.db.getHymns()
  res.send(hymns)
})


module.exports = router
