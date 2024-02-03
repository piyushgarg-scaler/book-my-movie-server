const { Schema, model } = require('mongoose')

const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const Movie = model('movie', movieSchema)

module.exports = Movie