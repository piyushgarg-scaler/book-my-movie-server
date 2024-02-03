require('dotenv').config()

const express = require('express');

const app = express();
const PORT = process.env.PORT

if (!PORT) throw new Error('Missing PORT')

app.get('/', (req, res) => res.json({ status: 'Success' }))

app.listen(PORT, () => console.log(`Server started on PORT:${PORT}`))