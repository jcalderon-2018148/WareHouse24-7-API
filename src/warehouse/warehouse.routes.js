'use strict'

const api = require('express').Router();
const { test, add, gets, get, upd, dele, assign, deallocate, uploadImg, getImg, getClients } = require('./warehouse.controller');
const { ensureAdvance, isAdmin, isWorker } = require('../services/authenticated');
const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({ uploadDir: './src/uploads/warehouses/' });

/* ----- @admin ----- */
api.post('/add', [ensureAdvance, isAdmin], add);
api.get('/test', [ensureAdvance, isAdmin], test);
api.put('/update/:id', [ensureAdvance, isAdmin], upd);
api.delete('/delete/:id', [ensureAdvance, isAdmin], dele);

/* ----- @admin @worker ----- */
api.put('/assign/:id', [ensureAdvance, isWorker], assign);
api.put('/deallocate/:id', [ensureAdvance, isWorker], deallocate);
api.put('/upload-img/:id', [ensureAdvance, isWorker, upload], uploadImg);
api.get('/get-img/:file', [upload], getImg);
api.get('/get-clients', [ensureAdvance, isWorker], getClients);

/* ----- @global ----- */
api.get('/get', ensureAdvance, gets);
api.get('/get/:id', ensureAdvance, get);

module.exports = api;