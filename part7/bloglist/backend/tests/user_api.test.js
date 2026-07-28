const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
// const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const api = supertest(app)

// npm test -- tests/user_api.test.js

beforeEach(async () => {
  await User.deleteMany({})
  const initialUsers = [
    {
      username: 'first_username',
      passwordHash: 'first_password',
      name: 'First User',
    },
    {
      username: 'second_username',
      passwordHash: 'second_password',
      name: 'Second User',
    }
  ]
  for (let user of initialUsers) {
      let userObject = new User(user)
      await userObject.save() // 
  }
})

describe('GET /api/users', () => {
  test('should return all users', async () => {
    const response = await api.get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, 2)
  })
  // format
  test('users should have id field', async () => {
    const response = await api.get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const users = response.body
    users.forEach(user => {
        assert.ok(user.id)
    })
  })
})

describe('POST /api/users', () => {
  test('should create a new user', async () => {
    const newUser = {
      username: 'new_username',
      name: 'New User',
      password: 'new_password'
    }
    await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 3)
    const usernames = usersAtEnd.map(u => u.username)
    assert.ok(usernames.includes('new_username'))
  })
  test('should not create user with short password', async () => {
    const newUser = {
      username: 'short_password_user',
      name: 'Short Password User',
      password: 'pw'
    }
    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.error, 'password missing or too short')
    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 2)
  })

  test('should not create user with short username', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short Username User',
      password: 'validpassword'
    }
    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      assert.ok(response.body.error.includes('User validation failed'))
      const usersAtEnd = await User.find({})
      assert.strictEqual(usersAtEnd.length, 2)
  })
  test('unique username constraint', async () => {
    const newUser = {
      username: 'first_username',
      name: 'Duplicate User',
      password: 'anotherpassword'
    }
    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert.ok(response.body.error.includes('duplicate key error'))
    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 2)
  })
  test('should not reveal passwordHash in response', async () => {
    const newUser = {
      username: 'secure_user',
      name: 'Secure User',
      password: 'securepassword'
    }
    const response = await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.passwordHash, undefined)
  })
})



after(async () => {
    await mongoose.connection.close()
})
