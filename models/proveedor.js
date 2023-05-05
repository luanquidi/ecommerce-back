'use strict'

// Se declaran modulos.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creación del modelo en base de datos para los cupones.
const ProveedorSchema = Schema({
    nombre: { type: String, required: true },
    referencia: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
});

// Se exporta modulo.
module.exports = mongoose.model('proveedor', ProveedorSchema);