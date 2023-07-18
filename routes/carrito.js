'use strict'

// Se declaran modulos.
const express = require('express');
const carritoController = require('../controllers/CarritoController');

// Se establece el router.
const api = express.Router();
const auth = require('../middlewares/authenticate');

api.post('/agregarCarrito', auth.auth, carritoController.agregarCarrito);
api.get('/obtenerCarrito/:id', auth.auth, carritoController.obtenerCarrito);
api.post('/obtenerCarrito', carritoController.obtenerCarrito);
api.delete('/eliminarCarrito/:id', auth.auth, carritoController.eliminarCarrito);





// Se exporta modulo.
module.exports = api;