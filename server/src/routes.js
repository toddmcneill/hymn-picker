const express = require('express')

const router = express.Router()

router.get('/users', async (req, res) => {
  const users = await req.db.getUsers()
  res.send(users)
})

router.get('/user/:id', async (req, res) => {
  console.log(req.params)
  const user = await req.db.getUserById(req.params.id)
  res.send(user)
})

router.get('/hymns', async (req, res) => {
  const hymns = await req.db.getHymns()
  res.send(hymns)
})

module.exports = router
