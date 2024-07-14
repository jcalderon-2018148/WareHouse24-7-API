'use strict'

require('dotenv').config();
const { connect } = require('./configs/mongo');
const { initServer } = require('./configs/app');
const { defaultUser } = require('./src/user/user.controller');

connect();
defaultUser();
initServer();