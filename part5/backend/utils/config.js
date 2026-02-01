require('dotenv').config()

let MONGODB_URI
if (process.env.NODE_ENV === 'test') {
  console.log("Using test database")
  MONGODB_URI= process.env.TEST_MONGODB_URI
} else {
  console.log("Using normal database")
  MONGODB_URI = process.env.MONGODB_URI
}
const PORT = process.env.PORT
// const MONGODB_URI = process.env.MONGODB_URI

// console.log('Connecting to', MONGODB_URI, "on port", PORT)

module.exports = { MONGODB_URI, PORT }
