'use strict'

// Se declaran modulos.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creación del modelo en base de datos para los clientes.
const ProductoSchema = Schema({
    titulo: { type: String, required: true },
    slug: { type: String, required: true },
    galeria: [{ type: Object, required: false }],
    variedades: [{ type: Object, required: false }],
    tituloVariedad: { type: String, required: false },
    portada: { type: String, required: false },
    referencia: { type: String, required: false },
    precio: { type: Number, required: true },
    precioProveedor: { type: Number, required: true },
    descripcion: { type: String, required: true },
    contenido: { type: String, required: true },
    stock: { type: Number, required: true },
    nVentas: { type: Number, required: true, default: 0 },
    npuntos: { type: Number, required: true, default: 0 },
    proveedor: { type: Schema.ObjectId, ref: 'proveedor', required: false },
    categoria: { type: String, required: true },
    estado: { type: String, required: true, default: 'Edicion' },
    createdAt: { type: Date, required: true, default: Date.now },
});

// Se exporta modulo.
module.exports = mongoose.model('producto', ProductoSchema);