'use strict'

// Se declaran variables de controlador.
const cupon = require("../models/cupon");

// Método para registrar un producto.
const registrarCupon = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se procesa la data.
            const data = req.body;
            // Se crea el cupon
            const cuponCreado = await cupon.create(data);

            res.status(200).send({
                datos: true,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });

        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

const listarCupones = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se declaran variables
            const filtro = req.params['filtro'];
            if (filtro == null || filtro == 'null') {
                // Se valida existencia del usuario.
                const listadoCupones = await cupon.find().sort({ createdAt: -1 });

                res.status(200).send({
                    datos: listadoCupones,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } else {
                // Se valida existencia del usuario.
                const listadoCupones = await cupon.find({ codigo: new RegExp(filtro, 'i') }).sort({ createdAt: -1 });;

                res.status(200).send({
                    datos: listadoCupones,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            }



        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const obtenerCupon = async (req, res) => {
    // Se obtiene id.
    const id = req.params.id
    try {
        // Se valida existencia del cupon.
        const cuponEcontrado = await cupon.findById({ _id: id });
        res.status(200).send({
            datos: cuponEcontrado,
            resultadoExitoso: true,
            mensaje: 'Operación existosa!'
        });
    } catch (error) {
        res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El cupon no existe.' })
    }


}

const actualizarCupon = async (req, res) => {
    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se obtiene id.
            const id = req.params.id;
            const data = req.body;

            try {
                // Se valida existencia del usuario.
                const cuponActualizado = await cupon.findByIdAndUpdate({ _id: id }, {
                    codigo: data.codigo,
                    tipo: data.tipo,
                    valor: data.valor,
                    limite: data.limite
                });

                res.status(200).send({
                    datos: cuponActualizado,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } catch (error) {
                res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El cupon no existe.' })
            }
        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

const eliminarCupon = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se obtiene id.
            const id = req.params.id
            try {
                // Se valida existencia del cupon.
                const cuponEliminado = await cupon.findByIdAndRemove({ _id: id });
                res.status(200).send({
                    datos: false,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } catch (error) {
                res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El cupon no existe.' })
            }


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const validarCupon = async (req, res) => {

    if (req.user) {
        // Se procesa la data.
        const cuponCode = req.params.cupon;
        // Se crea el cupon
        const cuponExiste = await cupon.findOne({ codigo: cuponCode });


        if (cuponExiste) {
            if (cuponExiste.limite == 0) {
                res.status(200).send({
                    datos: false,
                    resultadoExitoso: false,
                    mensaje: 'El cupón ya no se encuentra disponible.'
                });
            } else {
                res.status(200).send({
                    datos: cuponExiste,
                    resultadoExitoso: true,
                    mensaje: 'Se aplicó cupón de manera exitosa!'
                });
            }
        } else {
            res.status(200).send({
                datos: false,
                resultadoExitoso: false,
                mensaje: 'Cupón no válido!'
            });
        }




    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}


module.exports = {
    registrarCupon,
    listarCupones,
    obtenerCupon,
    actualizarCupon,
    eliminarCupon,
    validarCupon
}