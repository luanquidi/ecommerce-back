'use strict'

// Se declaran modulos.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creación del modelo en base de datos para los clientes.
const ReviewSchema = Schema({
    producto: { type: Schema.ObjectId, ref: 'producto', required: true },
    cliente: { type: Schema.ObjectId, ref: 'cliente', required: true },
    venta: { type: Schema.ObjectId, ref: 'venta', required: true },
    review: { type: String, required: true },
    estrellas: { type: Number, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
});

// Se exporta modulo.
module.exports = mongoose.model('review', ReviewSchema);