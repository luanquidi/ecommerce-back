'use strict'

// Se declaran modulos.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creación del modelo en base de datos para los inventarios.
const InventarioSchema = Schema({
    producto: { type: Schema.ObjectId, ref: 'producto', required: true },
    admin: { type: Schema.ObjectId, ref: 'admin', required: true },
    cantidad: { type: Number, required: true },
    proveedor: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
});

// Se exporta modulo.
module.exports = mongoose.model('inventario', InventarioSchema);