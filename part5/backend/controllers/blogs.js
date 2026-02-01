const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  console.log('Creating new blog with body:', request.body)
  const blog = new Blog(request.body)
  if (!blog.title || !blog.url) {
    return response.status(400).end()
  }

  if (blog.likes === undefined) {
    blog.likes = 0
  }

  blog.user = request.user.id
  const postResponse = await blog.save()
  request.user.blogs = request.user.blogs.concat(postResponse.id)
  await request.user.save()
  const populatedBlog = await postResponse.populate('user', { username: 1, name: 1 })
  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  // if (!request.user) {
  //   return response.status(401).json({ error: 'token missing or invalid' })
  // }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }
  if (blog.user.toString() !== request.user.id.toString()) {
    return response.status(401).json({ error: 'only the creator can delete a blog' })
  }

  const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
  return response.status(204).end()
})


blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  console.log('Updating blog with id:', request.body)
  
  // Only allow updating specific fields, not the user field
  const { title, author, url, likes } = request.body
  const updateData = { title, author, url, likes }
  // const userId = request.user.id
  // updateData.user = userId // this is wrong
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      updateData,
      { new: true, runValidators: true, context: 'query' }
    ).populate('user', { username: 1, name: 1 })
    console.log('Updated blog:', updatedBlog)
    if (!updatedBlog) {
      return response.status(404).end()
    }
    return response.json(updatedBlog)
  } catch (error) {
    console.error('Error updating blog:', error)
    return response.status(500).json({ error: 'An error occurred while updating the blog' })
  }
})

module.exports = blogsRouter
