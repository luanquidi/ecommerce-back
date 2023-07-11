'use strict'

// Se declaran variables de controlador.
const admin = require("../models/admin");
const venta = require("../models/venta");
const dVenta = require("../models/detalleVenta");
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../helpers/jwt');


// ========================================================== MÉTODOS CONTROLADOR ====================================================

// Método para registrar un admin.
const registroAdmin = async (req, res) => {
    // Se procesa la data.
    const data = req.body;
    let listadoClientes = [];

    // Se valida existencia del usuario.
    listadoClientes = await admin.find({ email: data.email });

    if (listadoClientes.length === 0) {
        if (data.password) {
            bcrypt.hash(data.password, null, null, async function (err, hash) {
                if (hash) {
                    // Se registra el cliente
                    data.password = hash;
                    const reg = await admin.create(data);
                    res.status(200).send({
                        datos: true,
                        resultadoExitoso: true,
                        mensaje: 'Operación existosa!'
                    });
                } else res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'Error server.' })
            });
        } else res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'No hay una contraseña.' })


    } else res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El correo ya existe en la base de datos.' })
}

// Método para ingresar al sistema.
const loginAdmin = async (req, res) => {

    // Se procesa la data.
    const data = req.body;
    let listadoAdmin = [];

    // Se valida existencia del usuario.
    listadoAdmin = await admin.find({ email: data.email });

    console.log(data)

    // Se valida que exista el correo.
    if (listadoAdmin.length === 0) res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El correo no existe en la base de datos.' });
    else {
        // Se declara el admin seleccionado.
        const usuario = listadoAdmin[0];

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


// =========================================================================== VENTAS ==================================================================
const obtenerVentasAdmin = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            let ventas = [];
            const desde = req.params.desde;
            const hasta = req.params.hasta;

            if (desde != 'null' && hasta != 'null') {
                let ttDesde = Date.parse(new Date(`${desde}T00:00:00`)) / 1000;
                let ttHasta = Date.parse(new Date(`${hasta}T23:59:59`)) / 1000;

                let temVentas = await venta.find({ pendiente: { $ne: true } }).populate('cliente').populate('direccion').sort({ createdAt: -1 });

                for (const item of temVentas) {
                    let formatFecha = Date.parse(new Date(item.createdAt)) / 1000;
                    if (formatFecha >= ttDesde && formatFecha <= ttHasta) ventas.push(item);
                }

                res.status(200).send({
                    datos: ventas,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });

            } else {
                ventas = await venta.find({ pendiente: { $ne: true } }).populate('cliente').populate('direccion').sort({ createdAt: -1 });;

                res.status(200).send({
                    datos: ventas,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            }


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

// =========================================================================== VENTAS ==================================================================
const obtenerVentasPendientesAdmin = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {

            let nombreCliente = req.params.nombreCliente;

            if (nombreCliente != 'null') {
                let temVentas = await venta.find({ pendiente: true }).populate('cliente').populate('direccion').sort({ createdAt: -1 });
                let ventas = [];
                nombreCliente = nombreCliente.toLowerCase();
                for (const ventaItem of temVentas) {
                    if (ventaItem.cliente.apellidos.toLowerCase().includes(nombreCliente) || ventaItem.cliente.nombres.toLowerCase().includes(nombreCliente)) ventas.push(ventaItem)
                }
                res.status(200).send({
                    datos: ventas,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });

            } else {
                let ventas = await venta.find({ pendiente: true }).populate('cliente').populate('direccion').sort({ createdAt: -1 });;

                res.status(200).send({
                    datos: ventas,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            }


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

// =========================================================================== KPI ==================================================================
const kpiGananciasMensuales = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {

            let enero = 0;
            let febrero = 0;
            let marzo = 0;
            let abril = 0;
            let mayo = 0;
            let junio = 0;
            let julio = 0;
            let agosto = 0;
            let septiembre = 0;
            let octubre = 0;
            let noviembre = 0;
            let diciembre = 0;

            let gananciaTotal = 0;
            let gananciaMes = 0;
            let numeroVentasMesActual = 0;
            let numeroVentasMesAnterior = 0;
            let totalPendiente = 0;
            let numeroVentasPendientes = 0;


            const registroVentas = await venta.find({ pendiente: { $ne: true } });
            const pendientesVentas = await venta.find({ pendiente: true });
            numeroVentasPendientes = pendientesVentas.length;

            for (const pendienteItem of pendientesVentas) {
                totalPendiente += pendienteItem.subtotal;
            }

            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMes = currentDate.getMonth() + 1;

            for (const ventaItem of registroVentas) {
                let createdAtDate = new Date(ventaItem.createdAt);
                const mes = createdAtDate.getMonth() + 1;

                if (currentYear == createdAtDate.getFullYear()) {

                    gananciaTotal += ventaItem.subtotal;

                    if (currentMes == mes) {
                        gananciaMes += ventaItem.subtotal;
                        numeroVentasMesActual++;
                    }

                    if (currentMes - 1 == mes) numeroVentasMesAnterior++;

                    if (mes == 1) enero += ventaItem.subtotal;
                    if (mes == 2) febrero += ventaItem.subtotal;
                    if (mes == 3) marzo += ventaItem.subtotal;
                    if (mes == 4) abril += ventaItem.subtotal;
                    if (mes == 5) mayo += ventaItem.subtotal;
                    if (mes == 6) junio += ventaItem.subtotal;
                    if (mes == 7) julio += ventaItem.subtotal;
                    if (mes == 8) agosto += ventaItem.subtotal;
                    if (mes == 9) septiembre += ventaItem.subtotal;
                    if (mes == 10) octubre += ventaItem.subtotal;
                    if (mes == 11) noviembre += ventaItem.subtotal;
                    if (mes == 12) diciembre += ventaItem.subtotal;
                }
            }
            res.status(200).send({
                datos: {
                    enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre, gananciaTotal, gananciaMes, numeroVentasMesActual, numeroVentasMesAnterior, numeroVentasPendientes, totalPendiente
                },
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}


const cambiarEstadoVenta = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            const idVenta = req.params.id;

            await venta.findOneAndUpdate({ _id: idVenta }, {
                pendiente: false
            })



            res.status(200).send({
                datos: true,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });



        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}


// Se exportan todas las funcionalidades.
module.exports = {
    registroAdmin,
    loginAdmin,
    obtenerVentasAdmin,
    kpiGananciasMensuales,
    obtenerVentasPendientesAdmin,
    cambiarEstadoVenta
}