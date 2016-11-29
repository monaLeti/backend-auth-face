const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')



var app = express()

var router = require('./services/router')

mongoose.connect('mongodb://localhost:backend/backend')

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use('/v1', router)

var PORT = process.env.PORT || 3000
var HOST = process.env.host || '127.0.0.1'

console.log('Listening at', PORT, HOST)
app.listen(PORT, HOST)
