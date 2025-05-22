const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

morgan.token('data', (req, res) => { return JSON.stringify(req.body) })
//Formaatti tiny:lle + requestin data:
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "041-123456"
  },
  {
    id: "2",
    name: "Arto Hellas2",
    number: "042-123456"
  },
  {
    id: "3",
    name: "Arto Hellas3",
    number: "043-123456"
  },
  {
    id: "4",
    name: "Arto Hellas4",
    number: "044-123456"
  }
]

app.get("/info", (request, response) => {
  let message = "Phonebook has info for " + persons.length + " people"
  message += "<br /> <br />"
  message += new Date().toString()
  response.send(message)
})

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id == id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()  //not found
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = String(request.params.id)
  persons = persons.filter(p => p.id != id)

  response.status(204).end()
})

app.post("/api/persons", (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  const existing = persons.find(p => p.name === body.name)
  if (existing) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    id: String(Math.floor(Math.random() * 10000)),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})