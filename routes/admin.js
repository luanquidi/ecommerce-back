'use strict'

// Se declaran modulos.
const express = require('express');
const adminController = require('../controllers/AdminController');
const auth = require('../middlewares/authenticate');
// Se establece el router.
const api = express.Router();

// Ruta para el registro de admins.
api.post('/registroAdmin', adminController.registroAdmin);
// Ruta para el inicio de sesion de los administradores.
api.post('/loginAdmin', adminController.loginAdmin);


// ======================= VENTAS =============================
api.get('/obtenerVentasAdmin/:desde?/:hasta?', auth.auth, adminController.obtenerVentasAdmin)

// ======================= KPI =============================
api.get('/kpiGananciasMensuales', auth.auth, adminController.kpiGananciasMensuales)




// Se exporta modulo.
module.exports = api;