'use strict'

// Declaración de modulos.
const jwt = require('jwt-simple');
const moment = require('moment');
const secret = '++--Admin--++';

exports.auth = function(req, res, next){
    if(!req.headers.authorization) return res.status(403).send({ datos: null, resultadoExitoso: false, mensaje: 'No autorizado.' });

    const token = req.headers.authorization.replace(/['"]+/g,'');
    const segment = token.split('.');

    if (segment.length !== 3) return res.status(403).send({ datos: null, resultadoExitoso: false, mensaje: 'Token invalido.' });
    else {
        try {
            var payload = jwt.decode(token, secret);
            if (payload.exp <= moment().unix()) return res.status(403).send({ datos: null, resultadoExitoso: false, mensaje: 'Token expirado.' });

        } catch (error) {
            return res.status(403).send({ datos: null, resultadoExitoso: false, mensaje: 'Token invalido.' });
        }
    }

    req.user = payload;

    next();
}