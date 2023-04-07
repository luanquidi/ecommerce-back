'use strict'

// Se declaran modulos.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creación del modelo en base de datos para los clientes.
const CarritoSchema = Schema({
    producto: { type: Schema.ObjectId, ref: 'producto', required: true },
    cliente: { type: Schema.ObjectId, ref: 'cliente', required: true },
    cantidad: { type: Number, required: true },
    variedad: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
});

// Se exporta modulo.
module.exports = mongoose.model('carrito', CarritoSchema);