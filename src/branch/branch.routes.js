'use strict'

const api = require('express').Router();
const {test, getBranch, getBranches, addBranch, updatedBranch,
        disabledBranch,  uploadImg, getImg, deleteBranch} = require('./branch.controller');
const { ensureAdvance, isAdmin, isWorker } = require('../services/authenticated')
const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({uploadDir: './src/uploads/branches/'})
api.get('/test', test);

api.get('/get', ensureAdvance, getBranches);
api.get('/get/:id', ensureAdvance, getBranch);

api.post('/add', [ensureAdvance, isAdmin], addBranch);
api.put('/update/:id', [ensureAdvance, isAdmin], updatedBranch);
api.put('/disable/:id', [ensureAdvance, isAdmin], disabledBranch);
api.delete('/delete/:id', [ensureAdvance, isAdmin], deleteBranch)

api.put('/uploadImg/:id', [ensureAdvance, isWorker, upload], uploadImg)
api.get('/getImg/:file', [upload], getImg);

module.exports = api;