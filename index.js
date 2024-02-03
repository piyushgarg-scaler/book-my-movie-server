require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose')

const authRouter = require('./routes/authentication')

const app = express();
const PORT = process.env.PORT

if (!PORT) throw new Error('Missing PORT')

// Mongoose Connection
mongoose.connect(process.env.MONGODB_URI).then(() => console.log(`MongoDB Connected`))

// Middlewares
app.use(express.json())

app.get('/', (req, res) => res.json({ status: 'Success' }))

app.use(`/api/v1/auth`, authRouter)

app.listen(PORT, () => console.log(`Server started on PORT:${PORT}`))