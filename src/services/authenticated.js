'use strict'

const jwt = require('jsonwebtoken');

exports.ensureAdvance = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: `Doesn't contain header "AUTHORIZATION"` });
    } else {
        try {
            let token = req.headers.authorization.replace(/['"]+/g, '');
            var payload = jwt.decode(token, `${process.env.KEY_DECODE}`);
            if (Math.floor(Date.now()/1000) >= payload.exp) {
                return res.status(401).send({ message: `EXPIRED TOKEN :]` });
            }
        } catch (err) {
            console.error(err);
            return res.status(418).send({ message: `Invalid token` });
        }
        req.user = payload;
        next();
    }
}

exports.isAdmin = (req, res, next) => {
    try {
        let user = req.user
        if(user.role !== 'ADMIN') return res.status(403).send({message: 'Unauthorized user :('})
        next()
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error, unauthorized user :(', error: err})
    }
}

exports.isWorker = (req, res, next) => {
    try {
        let user = req.user
        if(user.role !== 'WORKER' && user.role !== 'ADMIN') return res.status(403).send({message: 'Unauthorized user'})
        next()
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error, unauthorized user :(', error: err, user: `${req.user.role}`})
    }
}