'use strict'

const mongoose = require('mongoose');

const wareHouseSchema = mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    size: {
        type: {
            heigth: {
                type: Number,
                required: true
            },
            length: {
                type: Number,
                required: true
            },
            depth: {
                type: Number,
                required: true
            },
            area: {
                type: Number,
                required: true
            }
        },
        required: true
    },
    services: {
        type: [{
            service: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Service',
                required: true
            }
        }],
        required: true
    },
    state: {
        type: String,
        required: true,
        uppercase: true,
        default: 'ACTIVE',
        enum: ['ACTIVE', 'DISABLE', 'LEASED']
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branche',
        required: true
    },
    lessee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    additionalService: {
        type: [{
            service: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Service'
            }

        }]
    },
    price: {
        type: Number
    },
    photo: {
        type: String
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('WareHouse', wareHouseSchema);
