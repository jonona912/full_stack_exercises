const express = require('express')
var morgan = require('morgan')
// const cors = require('cors')
const app = express()

app.use(express.static('dist'))
// app.use(cors())
app.use(express.json())
// app.use(morgan('tiny'))
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

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }
// app.use(requestLogger)

let notes = [
    {
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Jonik Jononzoda", 
      "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/api/persons', (req, res) => { 
  res.json(notes)
})

app.get('/info', (req, res) => {
    const info = `<p>Phonebook has infor for ${notes.length} people</p>`
    const requestTime = new Date()
    console.log("request time:", requestTime)
    res.send(`<p>Phonebook has infor for ${notes.length} people</p>
        <p>${requestTime}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
    const person = notes.find(note => note.id === req.params.id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

// const getNewId = () => {
//     const maxId = notes.length > 0
//         ? Math.max(...notes.map(note => Number(note.id)))
//         : 0
//     return (maxId + 1).toString()
// }

app.delete('/api/persons/:id', (req, res) => {
    const person = notes.find(note => note.id === req.params.id)
    notes = notes.filter(note => note.id !== req.params.id)
    if (person) {
        console.log("deleted", person)
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body

    if (!name || !number) {
        return res.status(400).json({ 
            error: 'name or number is missing' 
        })
    }

    const nameExists = notes.find(note => note.name === name)
    if (nameExists) {
        return res.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const newPerson = {
        id: (Math.random() * 1000000).toFixed(0),
        name,
        number
    }

    notes = notes.concat(newPerson)
    res.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
