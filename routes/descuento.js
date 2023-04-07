'use strict'

// Se declaran modulos.
const express = require('express');
const descuentoController = require('../controllers/DescuentoController');

// Se establece el router.
const api = express.Router();
const auth = require('../middlewares/authenticate');
const multyParty = require('connect-multiparty');
const path = multyParty({
    uploadDir: './uploads/descuentos'
})

api.post('/registrarDescuento', [auth.auth,path], descuentoController.registrarDescuento);
api.get('/listarDescuentos/:filtro?', auth.auth, descuentoController.listarDescuentos);
api.get('/obtenerBannerDescuento/:img', descuentoController.obtenerBannerDescuento);
api.get('/obtenerDescuento/:id', descuentoController.obtenerDescuento);
api.put('/actualizarDescuento/:id', [auth.auth, path], descuentoController.actualizarDescuento);
api.delete('/eliminarDescuento/:id', auth.auth, descuentoController.eliminarDescuento);
api.get('/obtenerDescuentoActivo', descuentoController.obtenerDescuentoActivo);


// Se exporta modulo.
module.exports = api;