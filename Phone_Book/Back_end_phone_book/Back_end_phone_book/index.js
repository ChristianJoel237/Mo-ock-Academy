require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const PERSON = require('./models/persons')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')

const app = express()

// ── Connexion MongoDB ────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error))

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

morgan.token('body', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
  return ''
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// ── Routes API ───────────────────────────────────────

// GET toutes les personnes
app.get('/api/persons', (request, response, next) => {
  PERSON.find({})
    .then((persons) => response.json(persons))
    .catch((error) => next(error))
})

// GET info
app.get('/info', (request, response, next) => {
  PERSON.countDocuments()
    .then((nb) => {
      const date = new Date().toString()
      response.send(`<p>Phonebook has info for ${nb} people</p><p>${date}</p>`)
    })
    .catch((error) => next(error))
})

// GET une personne par ID
app.get('/api/persons/:id', (request, response, next) => {
  PERSON.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
    .catch((error) => next(error))
})

// DELETE une personne
app.delete('/api/persons/:id', (request, response, next) => {
  PERSON.findByIdAndDelete(request.params.id)
    .then((deleted) => {
      if (deleted) {
        response.status(204).end()
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
    .catch((error) => next(error))
})

// POST nouvelle personne
app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  if (!name || !number) {
    return response.status(401).json({ error: 'all values must be required' })
  }
  new PERSON({ name, number })
    .save()
    .then((saved) => response.status(201).json(saved))
    .catch((error) => next(error))
})

// PUT mise à jour personne — findByIdAndUpdate (atomique)
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  PERSON.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updated) => {
      if (updated) {
        response.json(updated)
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
    .catch((error) => next(error))
})

// ── Error handler ────────────────────────────────────
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted Id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

// ── Démarrage local ──────────────────────────────────
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app