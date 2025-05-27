const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(url).then(result => {
  console.log('connected to MongoDB')
}).catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: number => {
        const parts = number.split("-")
        if (parts.length !== 2) { //has two parts separated by one dash
          return false
        }
        if (parts[0].length + parts[1].length < 8) { //total length is at least 8
          return false
        }
        return /^\d{2,3}$/.test(parts[0]) && /^\d+$/.test(parts[1]) //first part length is either 2 or 3 digits, and last part has only digits
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  },
  id: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)