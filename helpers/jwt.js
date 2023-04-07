'use strict'

// Se declaran modulos.
const jwt = require('jwt-simple');
const moment = require('moment');

// Credenciales secretas.
const secret = '++--Admin--++';

exports.createToken = function(user){
    const payload = {
        sub: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        rol: user.rol,
        email: user.email,
        lat: moment().unix(),
        exp: moment().add(7, 'days').unix()
    }

    return jwt.encode(payload, secret);
}