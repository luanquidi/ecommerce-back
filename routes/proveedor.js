'use strict'

// Se declaran modulos.
const express = require('express');
const proveedorController = require('../controllers/ProveedorController');

// Se establece el router.
const api = express.Router();
const auth = require('../middlewares/authenticate');

//  Ruta para el registro de cupones.
api.post('/registrarProveedor', auth.auth, proveedorController.registrarProveedor);
// Ruta para el filtro de cupones.
api.get('/listarProveedores', auth.auth, proveedorController.listarProveedores);
// Ruta para el obtener un cupon.
api.get('/obtenerProveedor/:id', auth.auth, proveedorController.obtenerProveedor);
// Ruta para actualizar cupon
api.put('/actualizarProveedor/:id', auth.auth, proveedorController.actualizarProveedor);
// Ruta para eliminar un cupon.
api.delete('/eliminarProveedor/:id', auth.auth, proveedorController.eliminarProveedor);

// Se exporta modulo.
module.exports = api;