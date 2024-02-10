require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')

const { authenticationMiddleware } = require('./middlewares/authentication')

const authRouter = require('./routes/authentication')
const movieRouter = require('./routes/movie')
const theatreRouter = require('./routes/theatre')
const scheduleRouter = require('./routes/movieSchedule')

const app = express();
const PORT = process.env.PORT

if (!PORT) throw new Error('Missing PORT')

// Mongoose Connection
mongoose.connect(process.env.MONGODB_URI).then(() => console.log(`MongoDB Connected`))

// Middlewares
app.use(express.json())
app.use(cors())
app.use(authenticationMiddleware())

app.get('/', (req, res) => res.json({ status: 'Success' }))

app.use(`/api/v1/auth`, authRouter)
app.use(`/api/v1/movies`, movieRouter)
app.use(`/api/v1/theatre`, theatreRouter)
app.use(`/api/v1/schedule`, scheduleRouter)

app.listen(PORT, () => console.log(`Server started on PORT:${PORT}`))