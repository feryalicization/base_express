
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()

const port = process.env.PORT

app.use(bodyParser.json())

const Routes = require('./routes/user')
const errorHandler = require('./routes/errorHandler') 

app.use(errorHandler)

app.use('/user', Routes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
