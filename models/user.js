const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const User = model('user', userSchema)

module.exports = User