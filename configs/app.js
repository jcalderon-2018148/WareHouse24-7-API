'use strict'

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan')
const app = express();
const port = process.env.PORT || 3022;

/* ----- IMPORT ROUTES ----- */
const serviceRoutes = require('../src/service/service.routes');
const userRoutes = require('../src/user/user.routes');
const wineyRoutes = require('../src/warehouse/warehouse.routes');
const branchRoutes = require('../src/branch/branch.routes');

/* ----- CONFIG SERVER ----- */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/service', serviceRoutes);
app.use('/user', userRoutes);
app.use('/warehouse', wineyRoutes);
app.use('/branch', branchRoutes);

/* ----- STAR SERVER ----- */
exports.initServer = () => {
    app.listen(port);
    console.log(`Server HTTP running in port ${port}`);
}