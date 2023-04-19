'use strict'

// Se declaran modulos.
const express = require('express');
const ventaController = require('../controllers/VentaController');

// Se establece el router.
const api = express.Router();
const auth = require('../middlewares/authenticate');

api.post('/registrarCompra', auth.auth, ventaController.registrarCompra);
api.post('/registrarCompraAdmin', auth.auth, ventaController.registrarCompraAdmin);
api.post('/registrarCompraMercadoPago', auth.auth, ventaController.generarVenta);
api.get('/feedback', ventaController.feedbackUrl);
api.get('/obtenerFeedbackCompra/:id', auth.auth, ventaController.obtenerFeedbackCompra);
api.get('/enviarCorreoCompraCliente/:id', auth.auth, ventaController.enviarCorreoCompraCliente);


// Se exporta modulo.
module.exports = api;