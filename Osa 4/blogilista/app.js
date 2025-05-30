const config = require('./utils/config')
require('express-async-errors')
const express = require('express')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI)

const app = express()

app.use(express.json())

app.use(middleware.tokenExtractor)

app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)

module.exports = app