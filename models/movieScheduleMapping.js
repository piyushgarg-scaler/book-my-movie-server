const { Schema, model } = require('mongoose')

const movieScheduleSchema = new Schema({
    movieId: {
        type: Schema.Types.ObjectId,
        ref: 'movie'
    },
    theatreId: {
        type: Schema.Types.ObjectId,
        ref: 'theatre'
    },
    startTime: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true,
    }
}, { timestamps: true })

movieScheduleSchema.index({ movieId: 1, theatreId: 1, startTime: 1 }, { unique: true })

const MovieSchedule = model('movieSchedule', movieScheduleSchema)

module.exports = MovieSchedule