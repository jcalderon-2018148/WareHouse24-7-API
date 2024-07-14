'use strict'

const mongoose = require('mongoose');

const branchSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    capitalGain: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true,
        uppercase: true,
        enum: ['ACTIVE', 'DISABLE']
    },
    photo: {
        type: String,
    }
}, {
    versionKey: false
});


module.exports = mongoose.model('Branche', branchSchema);