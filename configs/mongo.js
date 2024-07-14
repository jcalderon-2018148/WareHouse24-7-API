'use strict'

const mongoose = require('mongoose');

exports.connect = async() => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(`${process.env.URI_MONGO}`)
        console.log(`Connect to DB "WareHouse24-7"`);
    } catch (err) {
        console.error(err);
    }
}