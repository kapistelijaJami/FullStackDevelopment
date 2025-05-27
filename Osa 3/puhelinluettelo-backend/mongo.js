const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const pw = process.argv[2]

const url = "mongodb+srv://fullstack:" + pw + "@cluster0.l3t9tcz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  //Add number
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(result => {
    console.log("added " + person.name + " number " + person.number + " to notebook")
    mongoose.connection.close()
  })
} else {
  //List numbers
  Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(person => {
      console.log(person.name + " " + person.number)
    })
    mongoose.connection.close()
  })
}