'use strict'

// Se declaran modulos.
const express = require('express');
const configController = require('../controllers/ConfigController');

// Se establece el router.
const api = express.Router();
const auth = require('../middlewares/authenticate');
const multyParty = require('connect-multiparty');
const path = multyParty({
    uploadDir: './uploads/configuraciones'
})

//  Ruta para el registro de configuraciones.
api.post('/registrarConfig', auth.auth, configController.registrarConfig);
// Ruta para el filtro de configuraciones.
api.get('/listarConfig',auth.auth, configController.listarConfig);
// Ruta para obtener el logo.
api.get('/obtenerLogo/:img', configController.obtenerLogo);
// Ruta para obtener las categorias.
api.get('/obtenerCategorias', configController.obtenerCategorias);
// Ruta para el obtener un config.
api.get('/obtenerConfig', configController.obtenerConfig);
// Ruta para actualizar config.
api.put('/actualizarConfig', [auth.auth,path], configController.actualizarConfig);
// Ruta para eliminar un config.
api.delete('/eliminarConfig/:id', auth.auth, configController.eliminarConfig);



// Se exporta modulo.
module.exports = api;