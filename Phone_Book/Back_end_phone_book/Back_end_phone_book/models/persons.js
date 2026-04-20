const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d{6,}/.test(v)
      },
      message: props => `${props.value} n'est pas un numéro valide!`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('PERSON', personSchema)