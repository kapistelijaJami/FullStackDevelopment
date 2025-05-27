require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(express.static('dist'))
app.use(express.json())

morgan.token('data', (req, res) => { return JSON.stringify(req.body) })
//Formaatti tiny:lle + requestin data:
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get("/info", (request, response) => {
  Person.countDocuments({}).then(count => {
    let message = "Phonebook has info for " + count + " people"
    message += "<br /> <br />"
    message += new Date().toString()
    response.send(message)
  })
})

app.get("/api/persons", (request, response, next) => {
  Person.find({}).then((result) => {
    response.json(result)
  }).catch(error => next(error))
})

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id).then(result => {
    if (result) {
      response.json(result)
    } else {
      response.status(404).end()  //not found
    }
  }).catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  Person.find({ name: body.name }).then((result) => {
    if (result.length !== 0) {  //Person exists
      return response.status(400).json({ error: 'name must be unique' })
    }

    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then(result => {
      response.json(result)
    }).catch(error => next(error))
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  Person.findById(request.params.id).then(person => {
    if (!person) {
      return response.status(404).end()
    }

    person.name = body.name //Frontend doesn't update this, but we can still have it here for backend
    person.number = body.number

    return person.save().then(result => {
      response.json(result)
    }).catch(error => next(error))
  }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message, errorName: 'ValidationError' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})