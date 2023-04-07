'use strict'

// Se declaran modulos.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creación del modelo en base de datos para los cupones.
const CuponSchema = Schema({
    codigo: { type: String, required: true },
    tipo: { type: String, required: true }, // Porcentaje o Precio fijo
    valor: { type: Number, required: true },
    limite: { type: Number, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
});

// Se exporta modulo.
module.exports = mongoose.model('cupon', CuponSchema);