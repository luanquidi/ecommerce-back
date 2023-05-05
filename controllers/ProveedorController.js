'use strict'

// Se declaran variables de controlador.
const proveedor = require("../models/proveedor");

// Método para registrar un producto.
const registrarProveedor = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se procesa la data.
            const data = req.body;
            const proveedorCreado = await proveedor.create(data);

            res.status(200).send({
                datos: true,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });

        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

const listarProveedores = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se declaran variables
            // Se valida existencia del usuario.
            const listadoProveedores = await proveedor.find().sort({ createdAt: -1 });

            res.status(200).send({
                datos: listadoProveedores,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });




        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const obtenerProveedor = async (req, res) => {
    // Se obtiene id.
    const id = req.params.id
    try {
        // Se valida existencia del cupon.
        const proveedorEcontrado = await proveedor.findById({ _id: id });
        res.status(200).send({
            datos: proveedorEcontrado,
            resultadoExitoso: true,
            mensaje: 'Operación existosa!'
        });
    } catch (error) {
        res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El proveedor no existe.' })
    }


}

const actualizarProveedor = async (req, res) => {
    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se obtiene id.
            const id = req.params.id;
            const data = req.body;

            try {
                // Se valida existencia del usuario.
                const proveedorActualizado = await proveedor.findByIdAndUpdate({ _id: id }, {
                    nombre: data.nombre,
                    referencia: data.referencia
                });

                res.status(200).send({
                    datos: proveedorActualizado,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } catch (error) {
                res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El proveedor no existe.' })
            }
        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

const eliminarProveedor = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se obtiene id.
            const id = req.params.id
            try {
                const proveedorEliminado = await cupon.findByIdAndRemove({ _id: id });
                res.status(200).send({
                    datos: false,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } catch (error) {
                res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El proveedor no existe.' })
            }


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

module.exports = {
    registrarProveedor,
    listarProveedores,
    obtenerProveedor,
    actualizarProveedor,
    eliminarProveedor
}