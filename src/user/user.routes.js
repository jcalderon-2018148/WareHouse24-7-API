'use strict'

const api = require('express').Router();
const { ensureAdvance, isAdmin, isWorker } = require('../services/authenticated');
const { test, login, update, del, deleteUser, updatePassword, updateUser, addAccount, uploadImg, getImg, get, getUser } = require('./user.controller');
const connectMultiparty = require('connect-multiparty')
const upload = connectMultiparty({uploadDir: './src/uploads/users/'})

api.get('/test', test);

api.post('/login', login)

api.put('/update', ensureAdvance, update)
api.put('/updatePassword', ensureAdvance, updatePassword)
api.delete('/delete', ensureAdvance, del)

api.post('/addAccount', [ensureAdvance, isAdmin], addAccount)
api.put('/update/:id', [ensureAdvance, isAdmin], updateUser)
api.delete('/delete/:id', [ensureAdvance, isAdmin], deleteUser)
api.get('/get', [ensureAdvance, isWorker], get)
api.get('/get/:id', [ensureAdvance, isWorker], getUser)
api.put('/uploadImg/:id',  [ensureAdvance, isWorker, upload], uploadImg)
api.get('/getImg/:file', [upload], getImg)


module.exports = api;