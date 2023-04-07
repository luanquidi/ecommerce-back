'use strict'

// Se declaran modulos.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creación del modelo en base de datos para los administradores.
const ConfigSchema = Schema({
    categorias: [{ type: Object, required: true, }],
    razonSocial: { type: String, required: true },
    logo: { type: String, required: true },
    serie: { type: String, required: true },
    correlativo: { type: String, required: true },
});

// Se exporta modulo.
module.exports = mongoose.model('config', ConfigSchema);