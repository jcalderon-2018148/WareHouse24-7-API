'use strict'

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    names: {
        type: String,
        required: true
    },
    surnames: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        uppercase: true,
        enum: ['ADMIN', 'CLIENT', 'WORKER']
    },
    photo: {
        type: String,
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);