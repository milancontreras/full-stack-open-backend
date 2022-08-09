const http = require('http')
const express = require('express')
const { response } = require('express')
const app = express()
app.use(express.json())

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


app.post('/api/persons',(request, response)=>{

  const body = request.body
  console.log("body body:",body)
  console.log("body name:",body.name)
  console.log("body number:",body.number)
  
  if((!body.name)){
    return response.status(400).json({ 
      error: 'name is missing' 
    })
    
  }else if((!body.number)){
    return response.status(400).json({ 
      error: 'number is missing' 
    })
  }else if(persons.find(person=> person.name = body.number)){
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


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)