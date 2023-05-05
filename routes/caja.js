'use strict'

// Se declaran modulos.
const express = require('express');
const cajaController = require('../controllers/CajaController');

// Se establece el router.
const api = express.Router();
const auth = require('../middlewares/authenticate');

api.get('/obtenerCajaActiva', auth.auth, cajaController.obtenerCajaActiva);
api.post('/crearCaja', auth.auth, cajaController.crearCaja);
api.post('/agregarVentaCaja/:id', auth.auth, cajaController.agregarVentaCaja);
api.post('/agregarSalidaCaja/:id', auth.auth, cajaController.agregarSalidaCaja);
api.post('/eliminarSalidaCaja/:id', auth.auth, cajaController.eliminarSalidaCaja);
api.post('/cerrarCaja/:id', auth.auth, cajaController.cerrarCaja);







// Se exporta modulo.
module.exports = api;