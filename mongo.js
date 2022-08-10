const mongoose = require('mongoose')


if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const inputName = process.argv[3]
const inputNumber = process.argv[4]


const url =
  `mongodb+srv://fullstack:${password}@cluster0.wpnswub.mongodb.net/phonebook-api?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(!inputName || !inputNumber){

  Person.find({}).then(result => {
    console.log("phonebook: ")
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })

}else{
  const person = new Person({
    name: inputName,
    number: inputNumber,
  })
  
  person.save().then(result => {
    //console.log(result)
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
  
}



