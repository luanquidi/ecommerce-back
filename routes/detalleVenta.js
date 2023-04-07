'use strict'

// Se declaran modulos.
const express = require('express');
const detalleVentaController = require('../controllers/DetalleVentaController');

// Se establece el router.
const api = express.Router();
const auth = require('../middlewares/authenticate');

//  Ruta para el registro de cupones.
api.post('/registrarCupon', auth.auth, detalleVentaController.registrarCupon);
// Ruta para el filtro de cupones.
api.get('/listarCupones/:filtro?',auth.auth, detalleVentaController.listarCupones);
// Ruta para el obtener un cupon.
api.get('/obtenerCupon/:id', auth.auth, detalleVentaController.obtenerCupon);
// Ruta para actualizar cupon
api.put('/actualizarCupon/:id', auth.auth, detalleVentaController.actualizarCupon);
// Ruta para eliminar un cupon.
api.delete('/eliminarCupon/:id', auth.auth, detalleVentaController.eliminarCupon);

// Se exporta modulo.
module.exports = api;