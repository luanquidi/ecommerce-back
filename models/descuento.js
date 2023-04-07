'use strict'

// Se declaran modulos.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creación del modelo en base de datos para los cupones.
const DescuentoSchema = Schema({
    titulo: { type: String, required: true },
    banner: { type: String, required: true }, 
    descuento: { type: Number, required: true }, 
    fechaInicio: { type: String, required: true },
    fechaFin: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
});

// Se exporta modulo.
module.exports = mongoose.model('descuento', DescuentoSchema);