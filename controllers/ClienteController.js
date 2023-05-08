'use strict'

// Se declaran variables de controlador.
const cliente = require("../models/cliente");
const direccion = require("../models/direccion");
const review = require("../models/review");
const venta = require("../models/venta");
const dVenta = require("../models/detalleVenta");
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../helpers/jwt');


// ========================================================== MÉTODOS CONTROLADOR ====================================================

const registroCliente = async (req, res) => {

    // Se procesa la data.
    const data = req.body;
    let listadoClientes = [];

    // Se valida existencia del usuario.
    listadoClientes = await cliente.find({ email: data.email });

    if (listadoClientes.length === 0) {
        if (data.password) {
            bcrypt.hash(data.password, null, null, async function (err, hash) {
                if (hash) {
                    // Se registra el cliente
                    data.password = hash;
                    const reg = await cliente.create(data);
                    res.status(200).send({
                        datos: reg,
                        resultadoExitoso: true,
                        mensaje: 'Operación existosa!'
                    });
                } else res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'Error server.' })
            });
        } else res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'No hay una contraseña.' })


    } else res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El correo ya existe en la base de datos.' })
}

const loginCliente = async (req, res) => {

    // Se procesa la data.
    const data = req.body;
    let listadoClientes = [];

    // Se valida existencia del usuario.
    listadoClientes = await cliente.find({ email: data.email });

    // Se valida que exista el correo.
    if (listadoClientes.length === 0) res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El correo no existe en la base de datos.' });
    else {
        // Se declara el cliente seleccionado.
        const usuario = listadoClientes[0];

        // Se comparan las contraseñas.
        bcrypt.compare(data.password, usuario.password, async function (error, check) {
            if (check) {
                res.status(200).send({
                    datos: usuario,
                    token: jwt.createToken(usuario),
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } else res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'Credenciales de acceso no coinciden.' });
        });
    }
}

const listarClientesFiltro = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se declaran variables
            const tipo = req.params['tipo'];
            const filtro = req.params['filtro'];
            let listadoClientes = [];


            if (tipo === null || tipo === 'null') {
                // Se valida existencia del usuario.
                listadoClientes = await cliente.find();

                res.status(200).send({
                    datos: listadoClientes,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } else {
                if (tipo === 'apellidos') {
                    listadoClientes = await cliente.find({ apellidos: new RegExp(filtro, 'i') });

                    res.status(200).send({
                        datos: listadoClientes,
                        resultadoExitoso: true,
                        mensaje: 'Operación existosa!'
                    });

                } else if (tipo === 'correo') {
                    listadoClientes = await cliente.find({ email: new RegExp(filtro, 'i') });

                    res.status(200).send({
                        datos: listadoClientes,
                        resultadoExitoso: true,
                        mensaje: 'Operación existosa!'
                    });
                }
            }
        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const registroClienteAdmin = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se procesa la data.
            const data = req.body;
            let listadoClientes = [];

            // Se valida existencia del usuario.
            listadoClientes = await cliente.find({ email: data.email });

            if (listadoClientes.length === 0) {
                // if (data.password) {
                bcrypt.hash(`${data.email.split('@')[0]}1234`, null, null, async function (err, hash) {
                    if (hash) {
                        // Se registra el cliente
                        data.password = hash;
                        const reg = await cliente.create(data);
                        res.status(200).send({
                            datos: reg,
                            resultadoExitoso: true,
                            mensaje: 'Operación existosa!'
                        });
                    } else res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'Error server.' })
                });
                // } else res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'No hay una contraseña.' })


            } else res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El correo ya existe en la base de datos.' })
        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}


const actualizarClienteAdmin = async (req, res) => {
    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se obtiene id.
            const id = req.params.id;
            const data = req.body;

            try {
                // Se valida existencia del usuario.
                const clienteEncontrado = await cliente.findByIdAndUpdate({ _id: id }, {
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    telefono: data.telefono,
                    email: data.email,
                    fNacimiento: data.fNacimiento,
                    identificacion: data.identificacion,
                    genero: data.genero
                });

                res.status(200).send({
                    datos: clienteEncontrado,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } catch (error) {
                res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El cliente no existe.' })
            }
        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

const obtenerClienteAdmin = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se obtiene id.
            const id = req.params.id


            try {
                // Se valida existencia del usuario.
                const clienteEncontrado = await cliente.findById({ _id: id });
                res.status(200).send({
                    datos: clienteEncontrado,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } catch (error) {
                res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El cliente no existe.' })
            }


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const obtenerCliente = async (req, res) => {

    if (req.user) {
        // Se obtiene id.
        const id = req.params.id
        try {
            // Se valida existencia del usuario.
            const clienteEncontrado = await cliente.findById({ _id: id });
            clienteEncontrado.password = '';
            res.status(200).send({
                datos: clienteEncontrado,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });
        } catch (error) {
            res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El cliente no existe.' })
        }


    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const buscarClientePorIdentificacion = async (req, res) => {

    if (req.user) {
        // Se obtiene id.
        const id = req.params.identificacion
        try {
            // Se valida existencia del usuario.
            const clienteEncontrado = await cliente.findOne({ identificacion: id });

            if (clienteEncontrado) {
                clienteEncontrado.password = '';
                res.status(200).send({
                    datos: clienteEncontrado,
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

        } catch (error) {
            res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El cliente no existe.' })
        }


    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}



const actualizarClientePerfil = async (req, res) => {
    if (req.user) {
        // Se obtiene id.
        const id = req.params.id;
        const data = req.body;

        try {
            // Se valida existencia del usuario.
            if (data.password) {
                console.log('si')
                bcrypt.hash(data.password, null, null, async function (err, hash) {
                    if (hash) {
                        // Se registra el cliente
                        const clienteEncontrado = await cliente.findByIdAndUpdate({ _id: id }, {
                            nombres: data.nombres,
                            apellidos: data.apellidos,
                            telefono: data.telefono,
                            fNacimiento: data.fNacimiento,
                            identificacion: data.identificacion,
                            genero: data.genero,
                            password: hash
                        });

                        res.status(200).send({
                            datos: clienteEncontrado,
                            resultadoExitoso: true,
                            mensaje: 'Operación existosa!'
                        });
                    } else res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'Error server.' })
                });
            } else {
                console.log('no');
                const clienteEncontrado = await cliente.findByIdAndUpdate({ _id: id }, {
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    telefono: data.telefono,
                    fNacimiento: data.fNacimiento,
                    identificacion: data.identificacion,
                    genero: data.genero
                });
                res.status(200).send({
                    datos: clienteEncontrado,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            }
        } catch (error) {
            res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El cliente no existe.' })
        }
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

const eliminarClienteAdmin = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se obtiene id.
            const id = req.params.id


            try {
                // Se valida existencia del usuario.
                const clienteEliminado = await cliente.findByIdAndRemove({ _id: id });
                res.status(200).send({
                    datos: false,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } catch (error) {
                res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El cliente no existe.' })
            }


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

// =============================== ORDENES ==================================================
const obtenerOrdenes = async (req, res) => {

    if (req.user) {
        // Se declaran variables
        const id = req.params.id;
        // Se valida existencia del usuario.
        const comprasCliente = await venta.find({ cliente: id }).sort({ createdAt: -1 });
        if (comprasCliente.length > 0) {
            res.status(200).send({
                datos: comprasCliente,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });
        } else {
            res.status(200).send({
                datos: false,
                resultadoExitoso: false,
                mensaje: 'No hay ordenes'
            });
        }



    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}


const obtenerOrdenDetalle = async (req, res) => {

    if (req.user) {
        // Se declaran variables
        const id = req.params.id;


        try {
            const ventaEncontrada = await venta.findById({ _id: id }).populate('direccion');
            const detalles = await dVenta.find({ venta: id }).populate('venta').populate('producto');


            res.status(200).send({
                datos: { detalles, venta: ventaEncontrada },
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });
        } catch (error) {
            res.status(200).send({
                datos: false,
                resultadoExitoso: false,
                mensaje: 'No hay ordenes'
            });
        }



    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

// =============================== RESEÑAS ==================================================
const emitirReviewProductoCliente = async (req, res) => {

    if (req.user) {
        const data = req.body;
        const reviewCreada = await review.create(data);

        res.status(200).send({
            datos: reviewCreada,
            resultadoExitoso: true,
            mensaje: 'Operación existosa!'
        });

    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const obtenerReviewProductoCliente = async (req, res) => {

    const id = req.params.id;
    const reviewEncontrada = await review.find({ producto: id }).sort({ createdAt: -1 });

    res.status(200).send({
        datos: reviewEncontrada,
        resultadoExitoso: true,
        mensaje: 'Operación existosa!'
    });

}


const obtenerReviewPorCliente = async (req, res) => {
    if (req.user) {
        const id = req.params.id;
        const reviewEncontrada = await review.find({ cliente: id }).sort({ createdAt: -1 }).populate('cliente');

        res.status(200).send({
            datos: reviewEncontrada,
            resultadoExitoso: true,
            mensaje: 'Operación existosa!'
        });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

// =============================== DIRECCIONES ==================================================
const registrarDireccion = async (req, res) => {

    if (req.user) {
        // Se procesa la data.
        const data = req.body;
        const direccionesCliente = await direccion.find({ cliente: data.cliente });

        if (direccionesCliente.length == 0) {
            data.principal = true;
            const direccionRegistrada = await direccion.create(data);

            res.status(200).send({
                datos: direccionRegistrada,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });
        } else {
            if (data.principal) {
                const direccionesCliente = await direccion.find({ cliente: data.cliente });
                direccionesCliente.map(async (direccionActualizar) => {
                    await direccion.findByIdAndUpdate({ _id: direccionActualizar._id }, {
                        principal: false
                    })
                })
            }

            const direccionRegistrada = await direccion.create(data);

            res.status(200).send({
                datos: direccionRegistrada,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });
        }



    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

const listarDirecciones = async (req, res) => {

    if (req.user) {
        // Se declaran variables
        const id = req.params['id'];
        // Se valida existencia del usuario.
        const listadoDirecciones = await direccion.find({ cliente: id }).sort({ createdAt: -1 });

        res.status(200).send({
            datos: listadoDirecciones,
            resultadoExitoso: true,
            mensaje: 'Operación existosa!'
        });

    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const establecerPrincipal = async (req, res) => {

    if (req.user) {
        // Se procesa la data.
        const data = req.body;
        const direccionesCliente = await direccion.find({ cliente: data.cliente });

        direccionesCliente.map(async (direccionActualizar) => {
            if (direccionActualizar._id != data._id) {
                await direccion.findByIdAndUpdate({ _id: direccionActualizar._id }, {
                    principal: false
                })
            }
        })

        const direccionRegistrada = await direccion.findByIdAndUpdate({ _id: data._id }, {
            principal: true
        })
        res.status(200).send({
            datos: direccionRegistrada,
            resultadoExitoso: true,
            mensaje: 'Operación existosa!'
        });

    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

const obtenerDireccionPrincipal = async (req, res) => {

    if (req.user) {
        // Se declaran variables
        const id = req.params['id'];
        // Se valida existencia del usuario.
        const direccionPrincipal = await direccion.findOne({ cliente: id, principal: true })

        res.status(200).send({
            datos: direccionPrincipal,
            resultadoExitoso: true,
            mensaje: 'Operación existosa!'
        });

    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}



// Se exportan todas las funcionalidades.
module.exports = {
    registroCliente,
    loginCliente,
    listarClientesFiltro,
    registroClienteAdmin,
    obtenerClienteAdmin,
    actualizarClienteAdmin,
    eliminarClienteAdmin,
    obtenerCliente,
    actualizarClientePerfil,
    registrarDireccion,
    listarDirecciones,
    establecerPrincipal,
    obtenerDireccionPrincipal,
    obtenerOrdenes,
    obtenerOrdenDetalle,
    emitirReviewProductoCliente,
    obtenerReviewProductoCliente,
    obtenerReviewPorCliente,
    buscarClientePorIdentificacion
}