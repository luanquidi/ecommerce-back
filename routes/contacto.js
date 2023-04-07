'use strict'

// Se declaran modulos.
const express = require('express');
const contactoController = require('../controllers/ContactoController');

// Se establece el router.
const api = express.Router();
const auth = require('../middlewares/authenticate');

//  Ruta para el registro de cupones.
api.post('/enviarMensajeContacto',  contactoController.enviarMensajeContacto);
api.get('/obtenerMensajesContacto', auth.auth,  contactoController.obtenerMensajesContacto);
api.get('/cerrarMensajesContacto/:id', auth.auth,  contactoController.cerrarMensajesContacto);

// Se exporta modulo.
module.exports = api;