require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
// Person handles the MongoDB interactions
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req, res) => `${JSON.stringify(req.body)}`)
morgan.token('content_length', (req, res) => `${res.get('Content-Length')} -`)

app.use('/api/persons', (req, res, next) => {
  if (req.method === 'POST') {
    morgan(':method :url :status :content_length :response-time ms :body')(req, res, next)
  } else {
    app.use(morgan('tiny'))
    next()
  }
})

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/api/persons', (req, res) => {
  console.log("api persons")
  Person.find({}).then(contacts => {
    res.json(contacts)
  })
})

app.get('/info', (req, res) => {
    const info = `<p>Phonebook has infor for ${notes.length} people</p>`
    const requestTime = new Date()
    console.log("request time:", requestTime)
    res.send(`<p>Phonebook has infor for ${notes.length} people</p>
        <p>${requestTime}</p>
    `)
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
      .then(person => {
          if (person) {
              res.json(person)
          } else {
              res.status(404).end()
          }
      })
      .catch(error => next(error))
    //   .catch(error => {
    //       res.status(400).send({ error: 'malformatted id' })
    //   })
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id)
      .then(deletedPerson => {
          if (deletedPerson) {
              res.status(204).end()
          } else {
              res.status(404).json({ error: 'contact not found' })
          }
      })
      .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const { name, number } = req.body
    console.log("POST body:", req.body)
    if (!name || !number) {
        return res.status(400).json({ 
            error: 'name or number is missing' 
        })
    }

    Person.findOne({ name: name }).then(existingPerson => {
        if (existingPerson) {
            return res.status(400).json({ 
                error: 'name must be unique' 
            })
        } else {
            const person = new Person({
                name: name,
                number: number,
            })
            person.save().then(savedPerson => {
                res.json(savedPerson)
            })
        }
    }).catch(error => next(error))
        //{ res.status(500).json({ error: 'database error' })})
})

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body

    const updatedPerson = {
        name: name,
        number: number,
    }

    Person.findByIdAndUpdate(
        req.params.id,
        updatedPerson,
        { new: true, runValidators: true, context: 'query' }
    )
    .then(result => {
        res.json(result)
    })
    .catch(error => next(error))
})

const beforeErrorhandler = (error, req, res, next) => {
    console.log("after error handler")
    next(error)
}

const errorHandler = (error, req, res, next) => {
    console.error("error Handler: ", error.name)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

app.use(beforeErrorhandler)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

