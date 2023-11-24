
//HAPPY CODING  🤩🚀😃

//this is our main (node.js) file and we connent paths, mongoDB and .env here,
//from node.js to Routes folder then from Routes folder to 
//Controllers folder (which itself connected to its Schema (structure) folder).

require('dotenv').config()

const port = process.env.server_port
const express = require('express')
const app = express()

const { mongoose } = require('mongoose')
mongoose.connect(process.env.mongo_url)
console.log('Connected to MongoDB Database')

app.use(express.json())

//Routes

const productsRoute = require('./Router/products')
const usersRoute = require('./Router/users')

//API or paths

app.use('/productapi', productsRoute)
app.use('/userapi', usersRoute)

app.listen(port, console.log("Server is created at port 4000")) 