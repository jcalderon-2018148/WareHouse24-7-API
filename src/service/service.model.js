'use strict'

const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        uppercase: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Service', serviceSchema);