'use strict'

// Se declaran modulos.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creación del modelo en base de datos para los administradores.
const CajaSchema = Schema({
    base: { type: Number, required: true },
    ventas: [{ type: Object, required: false, }],
    efectivo: { type: Number, required: false },
    efectivoFinal: { type: Number, required: false, default: 0 },
    diferencial: { type: Number, required: false },
    activa: { type: Boolean, required: false },
    salidas: [{ type: Object, required: false, }],
    comentario: { type: String, required: false, },
    createdAt: { type: Date, required: true, default: Date.now },
});

// Se exporta modulo.
module.exports = mongoose.model('caja', CajaSchema);