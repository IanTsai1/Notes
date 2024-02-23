//imported express -> a function that is used to create an express application
const express = require('express')
const app = express()
// parses incoming requests with JSON payloads
//transforms json data into JS object
app.use(express.json())

var morgan = require('morgan')
const cors = require('cors')
const middleware = morgan('tiny')

//should apply globally so it can exectue in any incomign requests
//will log incoming requests, shown in console
app.use(middleware)

app.use(cors())

//allows it to show static content(html frontend)
app.use(express.static('dist'))

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
]

//define two http routes; "/" and "/api/notes"

//handles get() request made to "/root"
//"request" param contains info on http request; "response" define how the request is responded
app.get('/', (request, response) => {
    //request is answered by sending a string using the send() method
    response.send('<h1>Hello World!</h1>')
  })

//getting all notes
app.get('/api/notes', (request, response) => {
    //using json() method; send notes as a json string
    response.json(notes)
})

//getting a specific note
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id //this gets the "id" from the http link
  //id is a string so need to cast it to a number
  const note = notes.find(note => note.id === Number(id))
  if (note) { //if not is defined, this will be passed
    response.json(note)
  } else { //else show 404 error code instead of 200
    response.status(404).end()
  }
})

//deleting nnote
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})


const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

//add new note
app.post('/api/notes', (request, response) => {
  const body = request.body

  //no value for content
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

//general note:
/*
adding console.log() for CRUD  allows us to test if the backend behaves correctly
need to make sure posted content is correct type (JSON in this case)
  can check response content-type with "console.log(request.headers)"
*/

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})