'use strict'

const jwt = require('jsonwebtoken');

exports.createToken = async(user) => {
    try {
        let payload = {
            sub: user._id,
            names: user.name,
            surnames: user.surname,
            username: user.username,
            email: user.email,
            role: user.role,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 120) // 2hr
        }

        return jwt.sign(payload, `${process.env.KEY_DECODE}`);

    } catch (err) {
        console.error(err);
        return err;
    }
}