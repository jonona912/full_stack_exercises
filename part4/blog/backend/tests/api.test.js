const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const api = supertest(app)

// npm test -- tests/api.test.js

beforeEach(async () => {
  await Blog.deleteMany({})
  const initialBlogs = [
    {
      title: 'First blog',
      author: 'Author One',
      url: 'http://firstblog.com',
      likes: 10
    },
    {
      title: 'Second blog',
      author: 'Author Two',
      url: 'http://secondblog.com',
      likes: 20
    }
  ]
  for (let blog of initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save() // 
  }
})

// describe('GET /api/blogs', () => {
//   test('should return all blogs', async () => {
//     const response = await api.get('/api/blogs')
//       .expect(200)
//       .expect('Content-Type', /application\/json/)
//     assert.strictEqual(response.body.length, 2)
//   })
// })

describe('GET /api/blogs', () => {
  test('should return all blogs', async () => {
    // Check what's in DB first
    const blogsInDb = await Blog.find({})
    
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    assert.strictEqual(response.body.length, 2)
  })
})

describe('check id format', () => {
  test('should be id', async () => {
    const blogsInDb = await Blog.find({})
    const firstBlog = blogsInDb[0].toJSON()
    assert.ok(firstBlog.id)
  })
})

describe('POST /api/blogs', async () => {
  // npm test -- --test-name-pattern="should create a new blog"
  test('should create a new blog', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'Author Three',
      url: 'http://newblog.com',
      likes: 5
    }
    
  const postResponse = await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.ok(postResponse.body.id)
  assert.strictEqual(postResponse.body.title, newBlog.title)
  assert.strictEqual(postResponse.body.author, newBlog.author)
  assert.strictEqual(postResponse.body.url, newBlog.url)
  assert.strictEqual(postResponse.body.likes, newBlog.likes)
  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, 3)
  const titles = blogsAtEnd.map(b => b.title)
  assert.ok(titles.includes('New blog'))
  })
})

describe('POST /api/blogs missing likes', async () => {
  // npm test -- --test-name-pattern="should default likes to 0"
  test('should default likes to 0', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Author Four',
      url: 'http://blogwithoutlikes.com'
    }
    const postResponse = await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    assert.ok(postResponse.body.id)
    assert.strictEqual(postResponse.body.likes, 0)
    
    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, 3)
    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('Blog without likes'))
  })
})


describe('POST /api/blogs missing title and url', async () => {
  // npm test -- --test-name-pattern="should return 400 Bad Request"
  test('should return 400 Bad Request', async () => {
    const newBlog = {
      title: '',
      author: 'Author Five',
      url: ''
    }
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(400)
    
    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, 2)
  })
})

describe('DELETE /api/blogs/:id', async () => {
  // npm test -- --test-name-pattern="should delete a blog"
  describe('Valid deletion', () => {
    test('should delete a blog', async () => {
      const blogsAtStart = await Blog.find({})
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await Blog.find({})
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert.ok(!titles.includes(blogToDelete.title))
    })
  })

  describe('Invalid deletion', () => {
    // npm test -- --test-name-pattern="should return 404 for non-existing id"
    test('should return 404 for non-existing id', async () => {
      const nonExistingId = new mongoose.Types.ObjectId()
      console.log(`Testing deletion with non-existing id: ${nonExistingId}`)
      await api.delete(`/api/blogs/${nonExistingId}`)
        .expect(404)

      const blogsAtEnd = await Blog.find({})
      assert.strictEqual(blogsAtEnd.length, 2)
    })
  })
})


describe ('Update /api/blogs/:id', async () => {
  // npm test -- --test-name-pattern="should update a blog"
  test('should update a blog', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]
    const updatedData = {
      title: 'Updated Title',
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: 12
    }
    const updateResponse = await api.put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(updateResponse.body.title, updatedData.title)

    const blogsAtEnd = await Blog.find({})
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.title, updatedData.title)
  })
})

after(async () => {
  await mongoose.connection.close()
})
