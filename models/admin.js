'use strict'

// Se declaran modulos.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creación del modelo en base de datos para los administradores.
const AdminSchema = Schema({
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    telefono: { type: String, required: true },
    rol: { type: String, required: true },
    identificacion: { type: String, required: true },
});

// Se exporta modulo.
module.exports = mongoose.model('admin', AdminSchema);