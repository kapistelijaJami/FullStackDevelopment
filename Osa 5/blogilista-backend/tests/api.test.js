const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 5
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  }
]

const initialUsers = [
  {
    "username": "username",
    "name": "Name",
    "id": "6838e37ebd664a662aa60995"
  },
  {
    "username": "usefges",
    "name": "Name2",
    "id": "6838e647eaeeb248e976744f"
  },
  {
    "username": "usefges2",
    "name": "Name3",
    "id": "6838e905ce8068a790e51208"
  }
]

describe('testing /api/blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
  })

  describe('blog get method', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('there are two blogs', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, 2)
    })

    test('returned blogs have id attribute', async () => {
      const response = await api.get('/api/blogs')

      for (let blog of response.body) {
        assert(blog.id)
      }
    })
  })

  describe('blog post method', () => {
    test('adding a blog works', async () => {
      const newBlog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, initialBlogs.length + 1)

      const found = response.body.find(b => b.title === newBlog.title)
      assert(found)
      delete found.id
      assert.deepStrictEqual(found, newBlog)
    })

    test('when adding blog and likes is empty, it becomes 0', async () => {
      const newBlog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/"
      }

      const response = await api.post('/api/blogs').send(newBlog)

      assert.strictEqual(response.body.likes, 0)
    })

    test('when adding blog and title or url is empty, status code is 400', async () => {
      const newBlogNoUrl = {
        title: "React patterns",
        author: "Michael Chan",
      }

      const newBlogNoTitle = {
        author: "Michael Chan",
        url: "https://reactpatterns.com/"
      }

      await api
        .post('/api/blogs')
        .send(newBlogNoUrl)
        .expect(400)

      await api
        .post('/api/blogs')
        .send(newBlogNoTitle)
        .expect(400)
    })
  })

  describe('blog delete method', () => {
    test('delete single blog', async () => {
      const response = await api.get('/api/blogs')
      const originalId = response.body[0].id

      await api.delete('/api/blogs/' + originalId)

      const resultBlogs = await api.get('/api/blogs')

      assert.strictEqual(resultBlogs.body.length, initialBlogs.length - 1)

      const found = resultBlogs.body.find(b => b.id === originalId)
      assert.strictEqual(found, undefined)
    })
  })

  describe('blog put method', () => {
    test('update single blog', async () => {
      const response = await api.get('/api/blogs')
      const originalId = response.body[0].id
      const originalTitle = response.body[0].title
      const originalAuthor = response.body[0].author
      const originalUrl = response.body[0].url

      const updatedValues = {
        likes: 10
      }

      await api.put('/api/blogs/' + originalId).send(updatedValues)

      const resultBlogs = await api.get('/api/blogs')
      const found = resultBlogs.body.find(b => b.id === originalId)
      assert(found)
      assert.strictEqual(found.likes, 10)
      assert.strictEqual(found.title, originalTitle)  //title hasn't changed
      assert.strictEqual(found.author, originalAuthor)  //author hasn't changed
      assert.strictEqual(found.url, originalUrl)  //url hasn't changed
    })
  })
})

describe('testing /api/users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('salainen', 10)
    const users = initialUsers.map(u => ({ ...u, passwordHash: passwordHash }))
    await User.insertMany(users)
  })

  test('inserting new user', async () => {
    const newUser = { username: "testname", password: "secret" }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, initialUsers.length + 1)

    const found = response.body.find(u => u.username === newUser.username)
    assert(found)
    assert.strictEqual(found.username, newUser.username)
  })

  test('inserting same user twice returns correct error', async () => {
    const newUser = { username: "testname", password: "secret" }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(res.body.error, 'expected `username` to be unique')
  })

  test('cannot insert if too short username', async () => {
    const newUser = { username: "a", password: "secret" }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('cannot insert if too short password', async () => {
    const newUser = { username: "testname", password: "a" }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

after(async () => {
  await mongoose.connection.close()
})