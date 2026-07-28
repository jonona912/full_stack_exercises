const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const app = express() // to run express server
const path = require('path')

const mongoUrl = config.MONGODB_URI

mongoose.connect(mongoUrl, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(express.json()) // middleware to parse JSON bodies
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  console.log('In test mode - adding testing router')
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
else if (process.env.NODE_ENV === 'production') {
  console.log('In production mode - serving frontend')
  // Serve static files from the frontend build directory
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  // Handle all other routes by sending the index.html file
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
  })
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
