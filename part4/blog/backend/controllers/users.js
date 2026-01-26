const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')

usersRouter.get('/', async (request, response) => {
    console.log("Fetching all users")
    // The second parameter { title: 1 ...} selects only those specific fields from the blog documents
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    console.log("Creating a new user")
    const body = request.body

    if (!body.password || body.password.length < 3) {
      return response.status(400).json({ error: 'password missing or too short' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    console.log("Password hash: ", passwordHash, 'for password: ', body.password)
  
    const newUser = new User({
      username: body.username,
      name: body.name,
      passwordHash: passwordHash
    })

  try {
    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
  } catch (error) {
    console.error("Error saving user: ", error.message)
    response.status(400).json({ error: error.message })
  }
})


module.exports = usersRouter