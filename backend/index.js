const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();

const app = express()
const port = 1111
// To directly modify the databse through browser
app.use(cors())

//Middle ware for accessing req body
app.use(express.json())

// Available Routes
app.use('/api/auth/',require('./routes/auth'))
app.use('/api/notes/',require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNotebook listening on port ${port}`)
})