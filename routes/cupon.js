'use strict'

// Se declaran modulos.
const express = require('express');
const cuponController = require('../controllers/CuponController');

// Se establece el router.
const api = express.Router();
const auth = require('../middlewares/authenticate');

//  Ruta para el registro de cupones.
api.post('/registrarCupon', auth.auth, cuponController.registrarCupon);
// Ruta para el filtro de cupones.
api.get('/listarCupones/:filtro?', auth.auth, cuponController.listarCupones);
// Ruta para el obtener un cupon.
api.get('/obtenerCupon/:id', auth.auth, cuponController.obtenerCupon);
// Ruta para actualizar cupon
api.put('/actualizarCupon/:id', auth.auth, cuponController.actualizarCupon);
// Ruta para eliminar un cupon.
api.delete('/eliminarCupon/:id', auth.auth, cuponController.eliminarCupon);
// Ruta para validar un cupon.
api.get('/validarCupon/:cupon', auth.auth, cuponController.validarCupon);

// Se exporta modulo.
module.exports = api;