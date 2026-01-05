const express = require('express')
const mongoose = require('mongoose')
// const Blog = require('./models/blog')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')

const app = express() // to run express server

const mongoUrl = config.MONGODB_URI

mongoose.connect(mongoUrl, { family: 4 })
    .then(() => {
      console.log('connected to MongoDB')
    })
    .catch((error) => {
      console.log('error connecting to MongoDB:', error.message)
    })

app.use(express.json()) // middleware to parse JSON bodies
app.use('/api/blogs', blogsRouter)

module.exports = app
