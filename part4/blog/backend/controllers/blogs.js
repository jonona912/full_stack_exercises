const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// blogsRouter.get('/', (request, response) => {
//     Blog.find({}).then((blogs) => {
//       response.json(blogs)
//     })
// })

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

// blogsRouter.post('/', (request, response) => {
//     const blog = new Blog(request.body)

//     blog.save().then((result) => {
//       response.status(201).json(result)
//     })
// })

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    if (!blog.title || !blog.url) {
      return response.status(400).end()
    }
    if (blog.likes === undefined) {
      blog.likes = 0
    }
    const postResponse = await blog.save()
    response.status(201).json(postResponse)
})

blogsRouter.delete('/:id', async (request, response) => {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    if (!deletedBlog) {
      return response.status(404).end()
    }
    return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id, // :id is route parameter
    // new: true - Return the updated document (not the old one). Without this, you get the document before the update.
    // runValidators: true - Run the schema validators defined in your model (e.g., required fields, data types)
      request.body,
      { new: true, runValidators: true, context: 'query' }
    )
    if (!updatedBlog) {
      return response.status(404).end()
    }
    return response.json(updatedBlog)
})

module.exports = blogsRouter
