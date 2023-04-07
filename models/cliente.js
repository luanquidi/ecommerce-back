'use strict'

// Se declaran modulos.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creación del modelo en base de datos para los clientes.
const ClienteSchema = Schema({
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    perfil: { type: String, required: true, default: 'perfil.png' },
    telefono: { type: String, required: false },
    genero: { type: String, required: false },
    fNacimiento: { type: String, required: false },
    identificacion: { type: String, required: false },
    createdAt: { type: Date, required: true, default: Date.now },
});

// Se exporta modulo.
module.exports = mongoose.model('cliente', ClienteSchema);