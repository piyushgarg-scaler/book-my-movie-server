const { Schema, model } = require('mongoose')

const theatreSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        lat: { type: String, required: true, },
        lon: { type: String, required: true, },
        address: { type: String, required: true, }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Theatre = model('theatre', theatreSchema)

module.exports = Theatre