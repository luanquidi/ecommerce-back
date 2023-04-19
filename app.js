'use strict'

// Variables de inicio.
require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
});
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const mercadopago = require("mercadopago"); 
mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN || 'TEST-5254381570087218-032715-288872b3526381c24dca88a3eba275fd-181545197',
});
// Se establece puerto del servidor.
const port = process.env.PORT || 4201;
const url_bd = process.env.BD_URL || 'mongodb://127.0.0.1:27017/tienda';




// ============================================================== RUTAS ===================================================
const adminRoutes = require('./routes/admin');
const clienteRoutes = require('./routes/cliente');
const productoRoutes = require('./routes/producto');
const cuponRoutes = require('./routes/cupon');
const configRoutes = require('./routes/config');
const carritoRoutes = require('./routes/carrito');
const ventaRoutes = require('./routes/venta');
const detalleVentaRoutes = require('./routes/detalleVenta');
const descuentoRoutes = require('./routes/descuento');
const contactoRoutes = require('./routes/contacto');



// Se inicializa la app.
const app = express();

// ========================================================= SOCKET =========================================
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: { origin: '*' }
});

io.on('connection', function (socket) {
    socket.on('eliminarCarrito', function (data) {
        io.emit('nuevoCarrito', data);
    });

    socket.on('agregarCarrito', function (data) {
        io.emit('nuevoCarrito', data);
    });

    socket.on('removerCarrito', function (data) {
        io.emit('nuevoCarrito', data);
    });

});


// Se establece conexión a base de datos mongo.
mongoose.connect(url_bd, { useUnifiedTopology: true, useNewUrlParser: true }, (err, res) => {
    if (err) console.log(err);
    else {
        server.listen(port, () => {
            console.log("############################################################");
            console.log(`### SERVIDOR CORRIENDO CORRACTAMENTE EN EL PUERTO: ${port}. ###`);
            console.log("############################################################");
        });
    }
});

// Se realizan configuraciones para parsear información json.
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ extended: true, limit: '50mb' }));

// Configuración de cors.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
});


// Configuración de rutas.
app.use('/api', adminRoutes);
app.use('/api', clienteRoutes);
app.use('/api', productoRoutes);
app.use('/api', cuponRoutes);
app.use('/api', configRoutes);
app.use('/api', carritoRoutes);
app.use('/api', ventaRoutes);
app.use('/api', detalleVentaRoutes);
app.use('/api', descuentoRoutes);
app.use('/api', contactoRoutes);



// Se exporta el aplicativo
module.exports = app;