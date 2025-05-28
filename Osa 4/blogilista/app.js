const config = require('./utils/config')
const express = require('express')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI)

const app = express()

app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app