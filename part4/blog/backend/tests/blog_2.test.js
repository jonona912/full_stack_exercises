const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const api = supertest(app)

// npm test -- tests/blog_2.test.js

beforeEach(async () => {
  await User.deleteMany({})
  
  // Create users with actual bcrypt hashes
  const passwordHash1 = await bcrypt.hash('password1', 10)
  const passwordHash2 = await bcrypt.hash('password2', 10)
  
  const initialUsers = [
    {
      username: 'testuser1',
      passwordHash: passwordHash1,
      name: 'Test User One',
    },
    {
      username: 'testuser2',
      passwordHash: passwordHash2,
      name: 'Test User Two',
    }
  ]
  
  await User.insertMany(initialUsers)
})

describe('User API tests', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two users initially', async () => {
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, 2)
  })

  test('can login with valid credentials', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'password1' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    assert(response.body.token)
    assert.strictEqual(response.body.username, 'testuser1')
  })

  test('login fails with wrong password', async () => {
    await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'wrongpassword' })
      .expect(401)
  })

  test('can create a new user', async () => {
    const newUser = {
      username: 'testuser3',
      name: 'Test User Three',
      password: 'password3'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, 3)
  })

  test('user can add blog', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'password1' })
      .expect(200)

    const token = loginResponse.body.token

    const newBlog = {
      title: 'Test Blog',
      author: 'Author Name',
      url: 'http://example.com/test-blog',
      likes: 5
    }

    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(blogResponse.body.title, newBlog.title)
    assert.strictEqual(blogResponse.body.author, newBlog.author)
    assert.strictEqual(blogResponse.body.url, newBlog.url)
    assert.strictEqual(blogResponse.body.likes, newBlog.likes)
  })

  test('delete blog fails without token', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'password1' })
      .expect(200)
    const token = loginResponse.body.token

    const newBlog = {
      title: 'Blog to be deleted',
      author: 'Author Name',
      url: 'http://example.com/blog-to-delete',
      likes: 2
    }
    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogId = blogResponse.body.id

    await api
      .delete(`/api/blogs/${blogId}`)
      .expect(401)
  })

  test('delete blog', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'password1' })
      .expect(200)
    const token = loginResponse.body.token

    const newBlog = {
      title: 'Blog to be deleted',
      author: 'Author Name',
      url: 'http://example.com/blog-to-delete',
      likes: 2
    }

    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogId = blogResponse.body.id

    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })

  test('delete blog with wrong token', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'password1' })
      .expect(200)
    const token = loginResponse.body.token

    const newBlog = {
      title: 'Blog to be deleted',
      author: 'Author Name',
      url: 'http://example.com/blog-to-delete',
      likes: 2
    }

    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogId = blogResponse.body.id

    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer wrongtoken`)
      .expect(401)
  })
})

////////////////////
describe('POST /api/blogs edge cases', () => {
  test('fails with 401 when token is missing', async () => {
    const newBlog = {
      title: 'Blog without token',
      author: 'Author',
      url: 'http://example.com/no-token',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('fails with 401 when Authorization header has no Bearer prefix', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'password1' })
      .expect(200)

    const newBlog = {
      title: 'Blog without Bearer',
      author: 'Author',
      url: 'http://example.com/no-bearer',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', loginResponse.body.token) // Missing "Bearer "
      .send(newBlog)
      .expect(401)
  })

  test('fails with 400 when title is missing', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'password1' })
      .expect(200)

    const newBlog = {
      author: 'Author Name',
      url: 'http://example.com/no-title',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(400)
  })

  test('fails with 400 when url is missing', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'password1' })
      .expect(200)

    const newBlog = {
      title: 'Blog without URL',
      author: 'Author Name',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(400)
  })

  test('defaults likes to 0 when not provided', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'password1' })
      .expect(200)

    const newBlog = {
      title: 'Blog without likes',
      author: 'Author Name',
      url: 'http://example.com/no-likes'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('created blog has id property (not _id)', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'password1' })
      .expect(200)

    const newBlog = {
      title: 'Blog to check id',
      author: 'Author Name',
      url: 'http://example.com/check-id',
      likes: 3
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)

    assert.ok(response.body.id)
    assert.strictEqual(response.body._id, undefined)
  })

  test('blog is associated with the logged-in user', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'password1' })
      .expect(200)

    const newBlog = {
      title: 'User associated blog',
      author: 'Author Name',
      url: 'http://example.com/user-blog',
      likes: 5
    }

    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)

    assert.ok(blogResponse.body.user)
    
    // Verify user's blog list was updated
    const usersResponse = await api.get('/api/users')
    const user = usersResponse.body.find(u => u.username === 'testuser1')
    assert.ok(user.blogs.some(blog => blog.id === blogResponse.body.id))
  })
})

describe('DELETE /api/blogs/:id edge cases', () => {
  test('fails with 401 when token is missing', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'password1' })
      .expect(200)

    const newBlog = {
      title: 'Blog to delete without token',
      author: 'Author',
      url: 'http://example.com/delete-no-token',
      likes: 2
    }

    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)

    await api
      .delete(`/api/blogs/${blogResponse.body.id}`)
      .expect(401)
  })

  test('fails with 401 when token is invalid', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'password1' })
      .expect(200)

    const newBlog = {
      title: 'Blog to delete with invalid token',
      author: 'Author',
      url: 'http://example.com/delete-invalid-token',
      likes: 2
    }

    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)

    await api
      .delete(`/api/blogs/${blogResponse.body.id}`)
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401)
  })

  test('fails with 401 when user tries to delete another user\'s blog', async () => {
    // User 1 creates a blog
    const user1Login = await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'password1' })
      .expect(200)

    const newBlog = {
      title: 'User 1 blog',
      author: 'User 1',
      url: 'http://example.com/user1-blog',
      likes: 2
    }

    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${user1Login.body.token}`)
      .send(newBlog)
      .expect(201)

    // User 2 tries to delete it
    const user2Login = await api
      .post('/api/login')
      .send({ username: 'testuser2', password: 'password2' })
      .expect(200)

    await api
      .delete(`/api/blogs/${blogResponse.body.id}`)
      .set('Authorization', `Bearer ${user2Login.body.token}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('fails with 404 when blog does not exist', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'password1' })
      .expect(200)

    const nonExistentId = '507f1f77bcf86cd799439011'

    await api
      .delete(`/api/blogs/${nonExistentId}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(404)
  })

  test('fails with 400 when blog id is malformed', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'password1' })
      .expect(200)

    await api
      .delete('/api/blogs/invalidid123')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(400)
  })

  test('successfully deletes own blog and returns 204', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser1', password: 'password1' })
      .expect(200)

    const newBlog = {
      title: 'Blog to delete successfully',
      author: 'Author',
      url: 'http://example.com/delete-success',
      likes: 2
    }

    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)

    await api
      .delete(`/api/blogs/${blogResponse.body.id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(204)

    // Verify blog is actually deleted
    const blogsResponse = await api.get('/api/blogs')
    const blogIds = blogsResponse.body.map(b => b.id)
    assert.ok(!blogIds.includes(blogResponse.body.id))
  })
})

after(async () => {
  await mongoose.connection.close()
})