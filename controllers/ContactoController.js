'use strict'

// Se declaran variables de controlador.
const contacto = require("../models/contacto");

const enviarMensajeContacto = async (req, res) => {

    const data = req.body;
    data.estado = 'Abierto';
    const contactoCreado = await contacto.create(data);

    res.status(200).send({
        datos: contactoCreado,
        resultadoExitoso: true,
        mensaje: 'Operación existosa!'
    });

}

const obtenerMensajesContacto = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            const mensajes = await contacto.find().sort({createdAt: -1});

            res.status(200).send({
                datos: mensajes,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });

        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const cerrarMensajesContacto = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            const id = req.params.id;
            
            const contactoCerrado = await contacto.findByIdAndUpdate({_id: id}, {
                estado: 'Cerrado'
            });

            res.status(200).send({
                datos: contactoCerrado,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });

        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}







module.exports = {
    enviarMensajeContacto,
    obtenerMensajesContacto,
    cerrarMensajesContacto
}