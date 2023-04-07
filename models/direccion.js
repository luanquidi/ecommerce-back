'use strict'

// Se declaran modulos.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creación del modelo en base de datos para los clientes.
const DireccionSchema = Schema({
    cliente: { type: Schema.ObjectId, ref: 'cliente', required: true },
    destinatario: { type: String, required: true },
    identificacion: { type: String, required: true },
    zip: { type: String, required: true },
    direccion: { type: String, required: true },
    departamento: { type: String, required: true },
    municipio: { type: String, required: true },
    telefono: { type: String, required: true },
    principal: { type: Boolean, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
});

// Se exporta modulo.
module.exports = mongoose.model('direccion', DireccionSchema);