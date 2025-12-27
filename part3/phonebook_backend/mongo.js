const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

console.log('number of arguments:', process.argv.length)
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password> <name> <number>')
  console.log('or to display all entries: node mongo.js <password>')
  return
}

const password = process.argv[2]
const url = `mongodb+srv://phonebook_db_user:${password}@clusterphonebook.oblugey.mongodb.net/personContacts?retryWrites=true&w=majority&appName=ClusterPhonebook`
mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
  return
}

const name = process.argv[3]
const number = process.argv[4]
// console.log('password', password, 'adding new person', name, 'number', number)
// mongosh "mongodb+srv://clusterphonebook.oblugey.mongodb.net/" --apiVersion 1 --username phonebook_db_user --password THIS_IS_SECRET_:)
// const url = `mongodb+srv://fullstack:${password}@cluster0.a5qfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Parameter explanation for the connection string:
// mongodb+srv:// specifies the protocol for connecting to a MongoDB Atlas cluster using DNS seedlists.
// phonebook_db_user is the MongoDB username.
// ${password} is a variable that inserts the password provided as a command-line argument.
// @clusterphonebook.oblugey.mongodb.net/ is the address of the MongoDB cluster.
// The query parameters:
// retryWrites=true enables automatic retryable writes.
// w=majority ensures write operations are acknowledged by the majority of replica set members.
// appName=ClusterPhonebook names the application for monitoring in Atlas.

const person = new Person({
  name: name,
  number: number,
})

person.save().then(() => {
  console.log(`added ${name} number ${number} to phonebook`)
  mongoose.connection.close()
})
