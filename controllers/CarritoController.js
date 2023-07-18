'use strict'

// Se declaran variables de controlador.
const carrito = require("../models/carrito");
const producto = require("../models/producto");

const agregarCarrito = async (req, res) => {

    if (req.user) {
        // Se procesa la data.
        const data = req.body;
        const carritoCliente = await carrito.find({ cliente: data.cliente, producto: data.producto });
        if (carritoCliente.length > 0) {
            res.status(200).send({
                datos: false,
                resultadoExitoso: false,
                mensaje: 'Este producto ya existe en tu carrito'
            });
        } else {
            // Se crea el cupon
            const carritoCreado = await carrito.create(data);

            res.status(200).send({
                datos: carritoCreado,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });
        }

    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

const obtenerCarrito = async (req, res) => {

    // if (req.user) {
        // Se procesa la data.
        const carritoItems = req.body;
        let carritoItemsProducto = [];

        for (const productoItem of carritoItems) {
            const carritoCliente = await producto.findById({ _id: productoItem.producto });
            carritoItemsProducto.push({
                productoCarrito:productoItem,
                productoDetalle: carritoCliente
            })
        }

        res.status(200).send({
            datos: carritoItemsProducto,
            resultadoExitoso: true,
            mensaje: 'Operación existosa!'
        });

    // } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

const eliminarCarrito = async (req, res) => {

    if (req.user) {
        // Se procesa la data.
        const id = req.params['id'];

        const carritoCliente = await carrito.findByIdAndRemove({ _id: id });

        res.status(200).send({
            datos: carritoCliente,
            resultadoExitoso: true,
            mensaje: 'Operación existosa!'
        });

    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}


module.exports = {
    agregarCarrito,
    obtenerCarrito,
    eliminarCarrito
}