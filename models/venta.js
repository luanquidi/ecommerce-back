'use strict'

// Se declaran modulos.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creación del modelo en base de datos para los cupones.
const VentaSchema = Schema({
    cliente: { type: Schema.ObjectId, ref: 'cliente', required: true },
    nVenta: { type: String, required: true },
    subtotal: { type: Number, required: true },
    envioTitulo: { type: String, required: true },
    envioPrecio: { type: Number, required: true },
    transaccion: { type: String, required: true },
    cupon: { type: String, required: false },
    estado: { type: String, required: true },
    direccion: { type: Schema.ObjectId, ref: 'direccion', required: false },
    caja: { type: Schema.ObjectId, ref: 'caja', required: false },
    idOrdenMercadoPago: { type: String, required: false },
    nota: { type: String, required: false },
    createdAt: { type: Date, required: true, default: Date.now },
});

// Se exporta modulo.
module.exports = mongoose.model('venta', VentaSchema);