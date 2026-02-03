const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.use((req, res, next) => {
  console.log('Testing router hit:', req.method, req.path)
  next()
})

router.post('/reset', async (request, response) => {
  console.log('Resetting database...')
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router
