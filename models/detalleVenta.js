'use strict'

// Se declaran modulos.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creación del modelo en base de datos para los cupones.
const DetalleVentaSchema = Schema({
    producto: { type: Schema.ObjectId, ref: 'producto', required: true },
    cliente: { type: Schema.ObjectId, ref: 'cliente', required: true },
    venta: { type: Schema.ObjectId, ref: 'venta', required: true },
    subtotal: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    variedad: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
});

// Se exporta modulo.
module.exports = mongoose.model('detalleVenta', DetalleVentaSchema);