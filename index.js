const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors') 
const { response } = require('express')
const { allowedNodeEnvironmentFlags } = require('process')

morgan.token('body', function (req) { return JSON.stringify(req.body) })

const app = express()

app.use(cors())
app.use(express.json())
app.use( morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, 'body')!=='{}' ? tokens.body(req, 'body'): null
  ].join(' ')
}))


let persons = [
  {
    "name": "Milan 1",
    "number": "123",
    "id": 1
  },
  {
    "name": "Milan 2",
    "number": "1234",
    "id": 2
  },
  {
    "name": "Milan 3",
    "number": "12345",
    "id": 3
  },
  
]

app.get('/',(request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons',(request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id',(request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  //console.log(person)
  if(person){
    response.json(person)
  }else{
    response.status(404).json({
      error: 'Value not found'
    }).end()
  }
})

app.delete('/api/persons/:id',(request, response)=>{
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})


const generateId = () => {
  // const maxId = persons.length > 0
  //   ? Math.max(...persons.map(n => n.id))
  //   : 0
  // return maxId + 1

  return Math.floor(Math.random() * 1000)
}


app.post('/api/persons' ,(request, response)=>{

  const body = request.body

  if((!body.name)){
    return response.status(400).json({ 
      error: 'name is missing' 
    })
    
  }else if((!body.number)){
    return response.status(400).json({ 
      error: 'number is missing' 
    })

  }else if(persons.find(person => person.name === body.name)){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }
    
    const newPerson = {
      name: body.name,
      number: body.number,
      id: generateId()
    }

    persons = [...persons, newPerson]

    response.json(newPerson)
  })

app.get('/info',(request, response) => {
  response.send(`
    <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date}</p>
    </div>
  `)
})



const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)