'use strict'

// Se declaran variables de controlador.
const config = require("../models/config");
const fs = require('fs');
const path = require('path');

const registrarConfig = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se procesa la data.
            const data = req.body;
            // Se crea el config
            const configCreado = await config.create(data);

            res.status(200).send({
                datos: true,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });

        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

const listarConfig = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se declaran variables

            // Se valida existencia del usuario.
            const configEncontrada = await config.find();
            // console.log(configEncontrada)
            // let id = configEncontrada[0]._id
            // const listadoConfiges = await config.findById({ _id: id });

            res.status(200).send({
                datos: configEncontrada,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });

        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const obtenerConfig = async (req, res) => {
    // Se obtiene id.
    try {
        const configEncontrada = await config.find();
        const listadoConfiges = await config.findById({ _id: configEncontrada[0]._id });

        res.status(200).send({
            datos: listadoConfiges,
            resultadoExitoso: true,
            mensaje: 'Operación existosa!'
        });
    } catch (error) {
        res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El config no existe.' })
    }


}

const actualizarConfig = async (req, res) => {
    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se obtiene id.
            const id = req.params.id;
            const data = req.body;

            if (req.files) {
                const files = req.files;
                let imgPath = files.logo.path;
                let splitPatch = process.env.PATH_IMAGES || '\\';
                const nombreImg = imgPath.split(splitPatch)[2];


                const configEncontrada = await config.find();
                if (configEncontrada.length > 0) {
                    // Se valida existencia del usuario.
                    const configActualizado = await config.findByIdAndUpdate({ _id: configEncontrada[0]._id }, {
                        categorias: JSON.parse(data.categorias),
                        serie: data.serie,
                        razonSocial: data.razonSocial,
                        correlativo: data.correlativo,
                        logo: nombreImg
                    });

                    fs.stat(`./uploads/configuraciones/${configActualizado.logo}`, function (err) {
                        if (!err) {
                            fs.unlink(`./uploads/configuraciones/${configActualizado.logo}`, (err) => {
                                if (err) throw err;
                            });
                        }
                    });


                    res.status(200).send({
                        datos: configActualizado,
                        resultadoExitoso: true,
                        mensaje: 'Operación existosa!'
                    });


                } else {
                    res.status(200).send({
                        datos: false,
                        resultadoExitoso: false,
                        mensaje: 'No hay configuraciónes'
                    });
                }
            } else {
                const configEncontrada = await config.find();
                if (configEncontrada.length > 0) {
                    try {
                        // Se valida existencia del usuario.
                        const configActualizado = await config.findByIdAndUpdate({ _id: configEncontrada[0]._id }, {
                            categorias: data.categorias,
                            serie: data.serie,
                            razonSocial: data.razonSocial,
                            correlativo: data.correlativo
                        });

                        res.status(200).send({
                            datos: configActualizado,
                            resultadoExitoso: true,
                            mensaje: 'Operación existosa!'
                        });
                    } catch (error) {
                        res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'La configuración no existe.' })
                    }
                } else {
                    res.status(200).send({
                        datos: false,
                        resultadoExitoso: false,
                        mensaje: 'No hay configuraciónes'
                    });
                }
            }


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

const obtenerLogo = async (req, res) => {

    const img = req.params['img'];
    fs.stat(`./uploads/configuraciones/${img}`, function (err) {
        if (!err) {
            let pathImg = `./uploads/configuraciones/${img}`
            res.status(200).sendFile(path.resolve(pathImg));
        } else {
            let pathImg = `./uploads/default.jpg`
            res.status(200).sendFile(path.resolve(pathImg));
        }
    });
}

const eliminarConfig = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se obtiene id.
            const id = req.params.id
            try {
                // Se valida existencia del config.
                const configEliminado = await config.findByIdAndRemove({ _id: id });
                res.status(200).send({
                    datos: false,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } catch (error) {
                res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El config no existe.' })
            }


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const obtenerCategorias = async (req, res) => {
    // Se obtiene id.
    const id = req.params.id
    try {
        const configEncontrada = await config.find();
        const listadoConfiges = await config.findById({ _id: configEncontrada[0]._id }).sort({ createdAt: -1 });
        res.status(200).send({
            datos: listadoConfiges.categorias,
            resultadoExitoso: true,
            mensaje: 'Operación existosa!'
        });
    } catch (error) {
        res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El config no existe.' })
    }
}


module.exports = {
    registrarConfig,
    listarConfig,
    obtenerConfig,
    actualizarConfig,
    eliminarConfig,
    obtenerLogo,
    obtenerCategorias
}