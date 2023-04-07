'use strict'

// Se declaran modulos.
const express = require('express');
const clienteController = require('../controllers/ClienteController');

// Se establece el router.
const api = express.Router();
const auth = require('../middlewares/authenticate');

// Ruta para el registro de clientes.
api.post('/registro', clienteController.registroCliente);
// Ruta para el inicio de sesion de clientes.
api.post('/loginCliente', clienteController.loginCliente);
// Ruta para el listado de clientes.
api.get('/listarClientes/:tipo/:filtro?',auth.auth, clienteController.listarClientesFiltro);
// Ruta para el registro de clientes admin.
api.post('/registroClienteAdmin', auth.auth, clienteController.registroClienteAdmin);
// Ruta para actualizar los clientes admin.
api.put('/actualizarClienteAdmin/:id', auth.auth, clienteController.actualizarClienteAdmin);
// Ruta para actualizar los clientes.
api.put('/actualizarClientePerfil/:id', auth.auth, clienteController.actualizarClientePerfil);
// Ruta para el obtener un cliente admin.
api.get('/obtenerClienteAdmin/:id', auth.auth, clienteController.obtenerClienteAdmin);
// Ruta para el obtener un cliente.
api.get('/obtenerCliente/:id', auth.auth, clienteController.obtenerCliente);
// Ruta para eliminar un cliente admin.
api.delete('/eliminarClienteAdmin/:id', auth.auth, clienteController.eliminarClienteAdmin);

// ====================================== ORDENES =================================
api.get('/obtenerOrdenesCliente/:id',auth.auth, clienteController.obtenerOrdenes);
api.get('/obtenerOrdenDetalle/:id',auth.auth, clienteController.obtenerOrdenDetalle);


// ====================================== RESEÑAS =================================
api.post('/emitirReviewProductoCliente',auth.auth, clienteController.emitirReviewProductoCliente);
api.get('/obtenerReviewProductoCliente/:id', clienteController.obtenerReviewProductoCliente);
api.get('/obtenerReviewPorCliente/:id', auth.auth, clienteController.obtenerReviewPorCliente);


// ====================================== DIRECCIONES =================================
api.post('/registrarDireccion',auth.auth, clienteController.registrarDireccion);
api.get('/listarDirecciones/:id',auth.auth, clienteController.listarDirecciones);
api.put('/establecerPrincipal',auth.auth, clienteController.establecerPrincipal);
api.get('/obtenerDireccionPrincipal/:id',auth.auth, clienteController.obtenerDireccionPrincipal);





// Se exporta modulo.
module.exports = api;