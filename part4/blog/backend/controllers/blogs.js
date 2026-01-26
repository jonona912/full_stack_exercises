const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

// blogsRouter.get('/', (request, response) => {
//     Blog.find({}).then((blogs) => {
//       response.json(blogs)
//     })
// })

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
    response.json(blogs)
})

// blogsRouter.post('/', (request, response) => {
//     const blog = new Blog(request.body)

//     blog.save().then((result) => {
  //       response.status(201).json(result)
  //     })
  // })



blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const blog = new Blog(request.body)
  if (!blog.title || !blog.url) {
    return response.status(400).end()
  }

  if (blog.likes === undefined) {
    blog.likes = 0
  }
  // if (!request.user) {
  //   return response.status(401).json({ error: 'userId missing or not valid' })
  // }

  blog.user = request.user.id
  request.user.blogs = request.user.blogs.concat(blog.id)
  await request.user.save()
  const postResponse = await blog.save()
  response.status(201).json(postResponse)
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

// blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
//     const updatedBlog = await Blog.findByIdAndUpdate(
//       request.params.id, // :id is route parameter
//     // new: true - Return the updated document (not the old one). Without this, you get the document before the update.
//     // runValidators: true - Run the schema validators defined in your model (e.g., required fields, data types)
//       request.body,
//       { new: true, runValidators: true, context: 'query' }
//     )
//     if (!updatedBlog) {
//       return response.status(404).end()
//     }
//     return response.json(updatedBlog)
// })

module.exports = blogsRouter
