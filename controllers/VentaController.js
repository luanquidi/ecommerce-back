'use strict'

// Se declaran variables de controlador.
const venta = require("../models/venta");
const detalleVenta = require("../models/detalleVenta");
const producto = require("../models/producto");
const carrito = require("../models/carrito");
const mercadopago = require("mercadopago");
const port = process.env.PORT || 4201;



var fs = require('fs');
var handlebars = require('handlebars');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var path = require('path');



const registrarCompra = async (req, res) => {

    if (req.user) {
        // Se procesa la data.
        const data = req.body;
        const detalles = data.detalles;

        const ultimaVenta = await venta.find().sort({ createdAt: -1 });
        let serie = '';
        let correlativo = '';
        var numeroVenta = '';
        if (ultimaVenta.length === 0) {
            serie = '001';
            correlativo = '000001';
            numeroVenta = `${serie}-${correlativo}`
        } else {
            const ultVenta = ultimaVenta[0].nVenta.split('-');
            if (ultVenta[1] != '999999') {
                const nuevoCorrelativo = zfill(parseInt(ultVenta[1]) + 1, 6);
                numeroVenta = `${ultVenta[0]}-${nuevoCorrelativo}`
            } else if (ultVenta[1] == '999999') {
                const nuevaSerie = zfill(parseInt(ultVenta[0]) + 1, 3);
                numeroVenta = `${nuevaSerie}-000001`
            }
        }

        data.nVenta = numeroVenta;
        data.estado = 'Procesando';

        const ventaCreada = await venta.create(data);

        detalles.map(async (detalle) => {
            detalle.venta = ventaCreada._id;
            await detalleVenta.create(detalle);
            let elementoProducto = await producto.findById({ _id: detalle.producto });
            let nuevoStock = elementoProducto.stock - detalle.cantidad;
            await producto.findByIdAndUpdate({ _id: detalle.producto }, { stock: nuevoStock });
        });

        await carrito.remove({ cliente: data.cliente });

        await enviarCorreoCompra(ventaCreada._id);

        res.status(200).send({
            datos: ventaCreada,
            resultadoExitoso: true,
            mensaje: 'La compra se ha solicitado de manera exitosa, recuerda finalizar tu pago en la tienda.'
        });

    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

function zfill(number, width) {
    var numberOutput = Math.abs(number);
    var length = number.toString().length;
    var zero = "0";

    if (width <= length) {
        if (number < 0) {
            return ("-" + numberOutput.toString());
        } else {
            return numberOutput.toString();
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString());
        }

    }
}

const generarVenta = async (req, res) => {

    const data = req.body;

    let itemsProductos = [];
    data.detalles.map((itemProducto) => {
        itemsProductos.push(
            {
                title: itemProducto.titulo,
                unit_price: itemProducto.subtotal,
                quantity: itemProducto.cantidad
            },
        )
    })


    let preference = {
        items: itemsProductos,
        binary_mode: true,
        back_urls: {
            "success": `${process.env.URL_FEEDBACK}/api/feedback`,
            "failure": `${process.env.URL_FEEDBACK}/api/feedback`,
            "pending": `${process.env.URL_FEEDBACK}/api/feedback`
        },
        auto_return: 'approved',
        payment_methods: {
            excluded_payment_methods: [
                {
                    "id": "efecty"
                }
            ],
            excluded_payment_types: [
                {
                    "id": "efecty"
                }
            ]
        },
        metadata: data
        // venta: data
    };

    mercadopago.preferences
        .create(preference)
        .then(function (response) {
            global.id = response.body.id;
            res.status(200).send({
                datos: response.body,
                resultadoExitoso: true,
                mensaje: 'Operación exitosa'
            });
        })
        .catch(function (error) {
            res.status(200).send({
                datos: err,
                resultadoExitoso: false,
                mensaje: 'Error en la operacion'
            });
        });



}

const feedbackUrl = async (req, res) => {

    if (req.query.payment_id != 'null' && req.query.payment_id != null) {
        // Verificación de pago.
        const payment = await mercadopago.payment.findById(req.query.payment_id);
        const merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id);
        const preferenceId = merchantOrder.body.preference_id;
        const statusPayment = payment.body.status;

        if (statusPayment === 'approved') {

            const data = payment.body.metadata;
            const detalles = data.detalles;

            const existeVenta = await venta.find({ idOrdenMercadoPago: req.query.payment_id });
            if (existeVenta.length > 0) {
                res.redirect(`${this.process.env.URL_TIENDA}/#/tienda/detalle-compra/${req.query.payment_id}`)
            } else {

                const ultimaVenta = await venta.find().sort({ createdAt: -1 });
                let serie = '';
                let correlativo = '';
                var numeroVenta = '';
                if (ultimaVenta.length === 0) {
                    serie = '001';
                    correlativo = '000001';
                    numeroVenta = `${serie}-${correlativo}`
                } else {
                    const ultVenta = ultimaVenta[0].nVenta.split('-');
                    if (ultVenta[1] != '999999') {
                        const nuevoCorrelativo = zfill(parseInt(ultVenta[1]) + 1, 6);
                        numeroVenta = `${ultVenta[0]}-${nuevoCorrelativo}`
                    } else if (ultVenta[1] == '999999') {
                        const nuevaSerie = zfill(parseInt(ultVenta[0]) + 1, 3);
                        numeroVenta = `${nuevaSerie}-000001`
                    }
                }

                data.nVenta = numeroVenta;
                data.estado = 'Procesando';
                data.idOrdenMercadoPago = req.query.payment_id;
                data.transaccion = req.query.payment_id;
                data.envioTitulo = data.envio_titulo;
                data.envioPrecio = data.envio_precio;

                const ventaCreada = await venta.create(data);

                detalles.map(async (detalle) => {
                    detalle.venta = ventaCreada._id;
                    await detalleVenta.create(detalle);
                    let elementoProducto = await producto.findById({ _id: detalle.producto });
                    let nuevoStock = elementoProducto.stock - detalle.cantidad;
                    await producto.findByIdAndUpdate({ _id: detalle.producto }, { stock: nuevoStock });
                });

                await carrito.remove({ cliente: data.cliente });

                await enviarCorreoCompra(ventaCreada._id);

                res.redirect(`${this.process.env.URL_TIENDA}/#/tienda/detalle-compra/${req.query.payment_id}`)
            }
        }

    } else {
        res.redirect(`${this.process.env.URL_TIENDA}/#/tienda/carrito`)
    }



}


const obtenerFeedbackCompra = async (req, res) => {
    if (req.user) {
        try {
            const payment = await mercadopago.payment.findById(req.params.id);
            const merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id);
            const preferenceId = merchantOrder.body.preference_id;
            const statusPayment = payment.body.status;

            res.status(200).send({
                datos: {
                    payment: req.params.id,
                    status: statusPayment,
                    merchantOrder: payment.body.order.id,
                    paymentData: payment.body
                },
                resultadoExitoso: true,
                mensaje: 'Feedback'
            });
        } catch (err) {
            res.status(200).send({
                datos: false,
                resultadoExitoso: false,
                mensaje: 'Feedback'
            });
        }

    }
    else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

const enviarCorreoCompraCliente = async (req, res) => {

    const id = req.params.id;
    const ventaDetalle = await venta.findById({_id: id}).populate('cliente');
    const detalles = await detalleVenta.find({venta: id}).populate('producto');


    // Estructura correo.
    var cliente = `${ventaDetalle.cliente.nombres} ${ventaDetalle.cliente.apellidos}`
    var _id = ventaDetalle._id;
    var fecha = new Date(ventaDetalle.createdAt);
    var data = detalles;
    var subtotal = ventaDetalle.subtotal;
    var precio_envio = ventaDetalle.envioPrecio;

    // Envio de correo
    const readHTMLFile = function (path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'lquinones965@gmail.com',
            pass: 'jhjogpmintlfreie'
        }
    }));


    readHTMLFile(process.cwd() + '/mail.html', (err, html) => {
        let rest_html = ejs.render(html, { data: data, cliente: cliente, _id:_id, fecha: fecha, subtotal: subtotal, precio_envio: precio_envio  });

        var template = handlebars.compile(rest_html);
        var htmlToSend = template({ op: true });

        var mailOptions = {
            from: 'lquinones965@gmail.com',
            to: ventaDetalle.cliente.email,
            subject: 'Gracias por tu compra, Mi Tienda',
            html: htmlToSend
        };
        // res.status(200).send({ data: true });
        transporter.sendMail(mailOptions, function (error, info) {
            if (!error) {
                console.log('Email sent: ' + info.response);
            }
        });

    });
}

const enviarCorreoCompra = async (idVenta) => {

    const id = idVenta;
    const ventaDetalle = await venta.findById({_id: id}).populate('cliente');
    const detalles = await detalleVenta.find({venta: id}).populate('producto');


    // Estructura correo.
    var cliente = `${ventaDetalle.cliente.nombres} ${ventaDetalle.cliente.apellidos}`
    var _id = ventaDetalle._id;
    var fecha = new Date(ventaDetalle.createdAt);
    var data = detalles;
    var subtotal = ventaDetalle.subtotal;
    var precio_envio = ventaDetalle.envioPrecio;

    // Envio de correo
    const readHTMLFile = function (path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'lquinones965@gmail.com',
            pass: 'jhjogpmintlfreie'
        }
    }));


    readHTMLFile(process.cwd() + '/mail.html', (err, html) => {
        let rest_html = ejs.render(html, { data: data, cliente: cliente, _id:_id, fecha: fecha, subtotal: subtotal, precio_envio: precio_envio  });

        var template = handlebars.compile(rest_html);
        var htmlToSend = template({ op: true });

        var mailOptions = {
            from: 'lquinones965@gmail.com',
            to: ventaDetalle.cliente.email,
            subject: 'Gracias por tu compra, Mi Tienda',
            html: htmlToSend
        };
        // res.status(200).send({ data: true });
        transporter.sendMail(mailOptions, function (error, info) {
            if (!error) {
                console.log('Email sent: ' + info.response);
            }
        });

    });
}





module.exports = {
    registrarCompra,
    generarVenta,
    feedbackUrl,
    obtenerFeedbackCompra,
    enviarCorreoCompraCliente
}