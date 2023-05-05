'use strict'

// Se declaran variables de controlador.
const caja = require("../models/caja");

const obtenerCajaActiva = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {

            const cajaEncontrada = await caja.findOne({ activa: true });

            if (cajaEncontrada) {
                res.status(200).send({
                    datos: cajaEncontrada,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } else {
                res.status(200).send({
                    datos: null,
                    resultadoExitoso: false,
                    mensaje: 'Operación existosa!'
                });
            }


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const crearCaja = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {

            const cajaCreada = await caja.create(req.body);

            if (cajaCreada) {
                res.status(200).send({
                    datos: cajaCreada,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } else {
                res.status(200).send({
                    datos: null,
                    resultadoExitoso: false,
                    mensaje: 'Operación existosa!'
                });
            }


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const agregarVentaCaja = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            
            const cajaEncontrada = await caja.findById({_id: req.params.id});
            let ventasTmp = cajaEncontrada.ventas;
            ventasTmp.push(req.body);

            const cajaActualizada = await caja.findByIdAndUpdate({_id: req.params.id}, {
                ventas: ventasTmp
            });

            res.status(200).send({
                datos: cajaActualizada,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const agregarSalidaCaja = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            
            const cajaEncontrada = await caja.findById({_id: req.params.id});
            let salidasTmp = cajaEncontrada.salidas;
            salidasTmp.push(req.body);

            const cajaActualizada = await caja.findByIdAndUpdate({_id: req.params.id}, {
                salidas: salidasTmp
            });

            res.status(200).send({
                datos: cajaActualizada,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}


const eliminarSalidaCaja = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            
            const cajaEncontrada = await caja.findById({_id: req.params.id});
            let salidasTmp = req.body;

            const cajaActualizada = await caja.findByIdAndUpdate({_id: req.params.id}, {
                salidas: salidasTmp
            });

            res.status(200).send({
                datos: cajaActualizada,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const cerrarCaja = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            
            const cajaEncontrada = await caja.findById({_id: req.params.id});

            const cajaActualizada = await caja.findByIdAndUpdate({_id: req.params.id}, {
                efectivoFinal: req.body.efectivoFinal,
                comentario: req.body.comentario,
                diferencial: req.body.diferencial,
                activa: false
            });

            res.status(200).send({
                datos: cajaActualizada,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}







module.exports = {
    obtenerCajaActiva,
    crearCaja,
    agregarVentaCaja,
    agregarSalidaCaja,
    eliminarSalidaCaja,
    cerrarCaja
}