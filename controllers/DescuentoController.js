'use strict'

// Se declaran variables de controlador.
const descuento = require("../models/descuento");
const fs = require('fs');
const path = require('path');
const { CONSTANTS } = require("../config/constants");

const registrarDescuento = async (req, res) => {
    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se procesa la data.
            const data = req.body;
            const files = req.files;
            let imgPath = files.banner.path;
            let splitPatch = CONSTANTS.path;
            const nombreImg = imgPath.split(splitPatch)[2];

            data.banner = nombreImg;

            const reg = await descuento.create(data);

            res.status(200).send({
                datos: reg,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });

        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

const listarDescuentos = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se declaran variables
            const filtro = req.params['filtro'];
            if (filtro == null || filtro == 'null') {
                // Se valida existencia del usuario.
                const listadoDescuentos = await descuento.find().sort({ createdAt: -1 });

                res.status(200).send({
                    datos: listadoDescuentos,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } else {
                // Se valida existencia del usuario.
                const listadoDescuentos = await descuento.find({ titulo: new RegExp(filtro, 'i') }).sort({ createdAt: -1 });

                res.status(200).send({
                    datos: listadoDescuentos,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            }



        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const obtenerBannerDescuento = async (req, res) => {

    const img = req.params['img'];
    fs.stat(`./uploads/descuentos/${img}`, function (err) {
        if (!err) {
            let pathImg = `./uploads/descuentos/${img}`
            res.status(200).sendFile(path.resolve(pathImg));
        } else {
            let pathImg = `./uploads/default.jpg`
            res.status(200).sendFile(path.resolve(pathImg));
        }
    });
}

const obtenerDescuento = async (req, res) => {
    const id = req.params.id
    try {
        // Se valida existencia del usuario.
        const descuentoEncontrado = await descuento.findById({ _id: id });
        res.status(200).send({
            datos: descuentoEncontrado,
            resultadoExitoso: true,
            mensaje: 'Operación existosa!'
        });
    } catch (error) {
        res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El descuento no existe.' })
    }
}

const actualizarDescuento = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se procesa la data.
            const data = req.body;
            const id = req.params['id'];

            if (req.files) {
                const files = req.files;
                let imgPath = files.banner.path;
                let splitPatch = CONSTANTS.path;
                const nombreImg = imgPath.split(splitPatch)[2];


                const reg = await descuento.findByIdAndUpdate({ _id: id }, {
                    titulo: data.titulo,
                    descuento: data.descuento,
                    fechaInicio: data.fechaInicio,
                    fechaFin: data.fechaFin,
                    banner: nombreImg
                });

                fs.stat(`./uploads/descuentos/${reg.banner}`, function (err) {
                    if (!err) {
                        fs.unlink(`./uploads/descuentos/${reg.banner}`, (err) => {
                            if (err) throw err;
                        });
                    }
                });

                res.status(200).send({
                    datos: true,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } else {
                const reg = await descuento.findByIdAndUpdate({ _id: id }, {
                    titulo: data.titulo,
                    descuento: data.descuento,
                    fechaInicio: data.fechaInicio,
                    fechaFin: data.fechaFin
                });

                res.status(200).send({
                    datos: true,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            }


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

const eliminarDescuento = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se obtiene id.
            const id = req.params.id;

            try {
                const descuentoEliminado = await descuento.findByIdAndRemove({ _id: id });

                fs.stat(`./uploads/descuentos/${descuentoEliminado.portada}`, function (err) {
                    if (!err) {
                        fs.unlink(`./uploads/descuentos/${descuentoEliminado.portada}`, (err) => {
                            if (err) throw err;
                        });
                    }
                });

                res.status(200).send({
                    datos: false,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } catch (error) {
                res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El descuento no existe.' })
            }


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const obtenerDescuentoActivo = async (req, res) => {
    try {

        const descuentosEncontrados = await descuento.find().sort({ createdAt: -1 });
        const hoy = Date.parse(new Date().toString()) / 1000;
        const listaDescuentos = [];

        descuentosEncontrados.map((descuentoTmp) => {
            const dfechaInicio = Date.parse(`${descuentoTmp.fechaInicio}T00:00:00`) / 1000;
            const dfechaFin = Date.parse(`${descuentoTmp.fechaFin}T23:59:59`) / 1000;
            if (hoy >= dfechaInicio && hoy <= dfechaFin) listaDescuentos.push(descuentoTmp);
        });

        if (listaDescuentos.length > 0) {
            res.status(200).send({
                datos: listaDescuentos,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });
        } else res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'No hay descuentos.' })


    } catch (error) {
        res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El descuento no existe.' })
    }
}


module.exports = {
    registrarDescuento,
    listarDescuentos,
    obtenerBannerDescuento,
    obtenerDescuento,
    actualizarDescuento,
    eliminarDescuento,
    obtenerDescuentoActivo
}