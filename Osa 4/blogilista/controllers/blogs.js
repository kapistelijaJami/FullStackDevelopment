const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const newBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user._id
  }

  const blog = new Blog(newBlog)
  if (!blog.likes) {
    blog.likes = 0
  }

  if (!blog.title || !blog.url) {
    return response.status(400).end()
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() === user.id.toString()) {
    await blog.deleteOne()
    response.status(204).end()
  } else {
    return response.status(403).json({ error: 'You can only delete blogs created by yourself' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const newBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter