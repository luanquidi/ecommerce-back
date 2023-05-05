'use strict'

// Se declaran variables de controlador.
const producto = require("../models/producto");
const proveedorModel = require("../models/proveedor");
const review = require("../models/review");
const inventario = require("../models/inventario");
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../helpers/jwt');
const fs = require('fs');
const path = require('path');
const { CONSTANTS } = require("../config/constants");



// ========================================================== MÉTODOS CONTROLADOR ====================================================

// Método para registrar un producto.
const registroProducto = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se procesa la data.
            const data = req.body;
            const files = req.files;
            let imgPath = files.portada.path;
            let splitPatch = CONSTANTS.path;
            const nombreImg = imgPath.split(splitPatch)[2];

            data.portada = nombreImg;
            data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            const reg = await producto.create(data);

            // Se crea el inventario
            const inventarioCreado = await inventario.create({
                admin: req.user.sub,
                cantidad: data.stock,
                proveedor: 'Primer registro',
                producto: reg._id
            });

            let productosPorProveedor = await producto.find({ proveedor: data.proveedor }).sort({ createdAt: -1 });
            let proveedorEntrante = await proveedorModel.findById({ _id: data.proveedor });

            await producto.findOneAndUpdate({ _id: reg._id }, {
                referencia: `${proveedorEntrante.referencia}-${productosPorProveedor.length}`
            });

            res.status(200).send({
                datos: true,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });

        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}


// Método para listar los productos
const listarProductosFiltro = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se declaran variables
            const filtro = req.params['filtro'];
            if (filtro == null || filtro == 'null') {
                // Se valida existencia del usuario.
                const listadoProductos = await producto.find();

                res.status(200).send({
                    datos: listadoProductos,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } else {
                // Se valida existencia del usuario.
                const listadoProductos = await producto.find({ titulo: new RegExp(filtro, 'i') });

                res.status(200).send({
                    datos: listadoProductos,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            }



        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

// Método para obtener la portada
const obtenerPortada = async (req, res) => {

    const img = req.params['img'];
    fs.stat(`./uploads/productos/${img}`, function (err) {
        if (!err) {
            let pathImg = `./uploads/productos/${img}`
            res.status(200).sendFile(path.resolve(pathImg));
        } else {
            let pathImg = `./uploads/default.jpg`
            res.status(200).sendFile(path.resolve(pathImg));
        }
    });
}

// Método para obtener un producto.
const obtenerProducto = async (req, res) => {
    // Se obtiene id.
    const id = req.params.id
    try {
        // Se valida existencia del usuario.
        const productoEncontrado = await producto.findById({ _id: id });
        res.status(200).send({
            datos: productoEncontrado,
            resultadoExitoso: true,
            mensaje: 'Operación existosa!'
        });
    } catch (error) {
        res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El producto no existe.' })
    }


}

// Método para registrar un producto.
const actualizarProducto = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se procesa la data.
            const data = req.body;
            const id = req.params['id'];

            if (req.files) {
                const files = req.files;
                let imgPath = files.portada.path;
                let splitPatch = CONSTANTS.path;
                const nombreImg = imgPath.split(splitPatch)[2];

                const reg = await producto.findByIdAndUpdate({ _id: id }, {
                    titulo: data.titulo,
                    precio: data.precio,
                    descripcion: data.descripcion,
                    contenido: data.contenido,
                    stock: data.stock,
                    categoria: data.categoria,
                    portada: nombreImg
                });

                fs.stat(`./uploads/productos/${reg.portada}`, function (err) {
                    if (!err) {
                        fs.unlink(`./uploads/productos/${reg.portada}`, (err) => {
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
                const reg = await producto.findByIdAndUpdate({ _id: id }, {
                    titulo: data.titulo,
                    precio: data.precio,
                    descripcion: data.descripcion,
                    contenido: data.contenido,
                    stock: data.stock,
                    categoria: data.categoria,
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

// Método para eliminar un producto.
const eliminarProducto = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se obtiene id.
            const id = req.params.id;

            try {
                // Se valida existencia del usuario.
                const productoEliminado = await producto.findByIdAndRemove({ _id: id });

                fs.stat(`./uploads/productos/${productoEliminado.portada}`, function (err) {
                    if (!err) {
                        fs.unlink(`./uploads/productos/${productoEliminado.portada}`, (err) => {
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
                res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El producto no existe.' })
            }


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

// Método para listar los productos
const listarInventarioProducto = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se obtiene el inventario.
            const listadoProductos = await inventario.find({ producto: req.params.id }).populate('admin').sort({ createdAt: -1 });

            res.status(200).send({
                datos: listadoProductos,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });



        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });

}

const eliminarInventarioProductoAdmin = async (req, res) => {
    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se obtiene id.
            const id = req.params.id;

            try {
                // Se valida existencia del usuario.
                const registroEliminado = await inventario.findByIdAndRemove({ _id: id });
                // Se obtiene el producto.
                const prod = await producto.findById({ _id: registroEliminado.producto });
                // Se actualiza stock
                const nuevoStock = parseInt(prod.stock) - parseInt(registroEliminado.cantidad);
                // SE modifica producto en base de datos cambiandole el stock
                const productoActualizado = await producto.findByIdAndUpdate({ _id: registroEliminado.producto }, {
                    stock: nuevoStock
                });

                res.status(200).send({
                    datos: false,
                    resultadoExitoso: true,
                    mensaje: 'Operación existosa!'
                });
            } catch (error) {
                res.status(200).send({ datos: null, resultadoExitoso: false, mensaje: 'El registro no existe.' })
            }


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

// Método para registrar un producto.
const registroInventario = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se procesa la data.
            const data = req.body;
            // Se crea el inventario
            const inventarioCreado = await inventario.create({
                admin: req.user.sub,
                cantidad: data.cantidad,
                proveedor: data.proveedor,
                producto: data.producto

            });
            const prodActual = await producto.findById({ _id: data.producto });

            const nuevoStock = parseInt(prodActual.stock) + parseInt(inventarioCreado.cantidad);
            // Se actualiza stock
            const prod = await producto.findByIdAndUpdate({ _id: data.producto }, {
                stock: nuevoStock
            });

            res.status(200).send({
                datos: true,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });

        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

// Método para registrar un producto.
const actualizarVariedadesProducto = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se procesa la data.
            const data = req.body;
            const id = req.params['id'];

            const reg = await producto.findByIdAndUpdate({ _id: id }, {
                variedades: data.variedades,
                tituloVariedad: data.tituloVariedad
            });

            res.status(200).send({
                datos: true,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

// Método para registrar un producto.
const agregarImagenGaleria = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se procesa la data.
            const data = req.body;
            const id = req.params['id'];

            const files = req.files;
            let imgPath = files.imagen.path;
            let splitPatch = CONSTANTS.path;
            const nombreImg = imgPath.split(splitPatch)[2];



            const productoActualizado = await producto.findByIdAndUpdate({ _id: id }, {
                $push: {
                    galeria: {
                        imagen: nombreImg,
                        _id: data._id
                    }
                }
            });

            res.status(200).send({
                datos: true,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

const eliminarImagenGaleria = async (req, res) => {

    if (req.user) {
        if (req.user.rol === 'Administrador') {
            // Se procesa la data.
            const data = req.body;
            const id = req.params['id'];


            const productoActualizado = await producto.findByIdAndUpdate({ _id: id }, {
                $pull: {
                    galeria: {
                        _id: data._id
                    }
                }
            });

            fs.stat(`./uploads/productos/${data.imagen}`, function (err) {
                if (!err) {
                    fs.unlink(`./uploads/productos/${data.imagen}`, (err) => {
                        if (err) throw err;
                    });
                }
            });

            res.status(200).send({
                datos: true,
                resultadoExitoso: true,
                mensaje: 'Operación existosa!'
            });


        } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
    } else res.status(500).send({ datos: null, resultadoExitoso: false, mensaje: 'No access.' });
}

// ============================================================== METODOS PUBLICOS ========================
// Método para listar los productos
const listarProductosTienda = async (req, res) => {

    // Se declaran variables
    const filtro = req.params['filtro'];
    if (filtro == null || filtro == 'null') {
        // Se valida existencia del usuario.
        const listadoProductos = await producto.find().sort({ createdAt: -1 });

        res.status(200).send({
            datos: listadoProductos,
            resultadoExitoso: true,
            mensaje: 'Operación existosa!'
        });
    } else {
        // Se valida existencia del usuario.
        const listadoProductos = await producto.find({ titulo: new RegExp(filtro, 'i') }).sort({ createdAt: -1 });

        res.status(200).send({
            datos: listadoProductos,
            resultadoExitoso: true,
            mensaje: 'Operación existosa!'
        });
    }

}

// Método para listar los productos
const listarProductoSlug = async (req, res) => {

    // Se declaran variables
    const slug = req.params['slug'];
    // Se valida existencia del usuario.
    const listadoProductos = await producto.findOne({ slug: slug });

    res.status(200).send({
        datos: listadoProductos,
        resultadoExitoso: true,
        mensaje: 'Operación existosa!'
    });
}

// Método para listar los productos
const listarProductosRecomendados = async (req, res) => {

    // Se declaran variables
    const categoria = req.params['categoria'];
    // Se valida existencia del usuario.
    const listadoProductos = await producto.find({ categoria: categoria }).sort({ createdAt: -1 }).limit(8);

    res.status(200).send({
        datos: listadoProductos,
        resultadoExitoso: true,
        mensaje: 'Operación existosa!'
    });

}

// Método para listar los productos
const listarProductosNuevos = async (req, res) => {

    // Se valida existencia del usuario.
    const listadoProductos = await producto.find().sort({ createdAt: -1 }).limit(8);

    res.status(200).send({
        datos: listadoProductos,
        resultadoExitoso: true,
        mensaje: 'Operación existosa!'
    });

}

const listarProductosMasVendidos = async (req, res) => {

    // Se valida existencia del usuario.
    const listadoProductos = await producto.find().sort({ nVentas: -1 }).limit(8);

    res.status(200).send({
        datos: listadoProductos,
        resultadoExitoso: true,
        mensaje: 'Operación existosa!'
    });

}

const obtenerReviewsPublicoProducto = async (req, res) => {

    const id = req.params.id;
    // Se valida existencia del usuario.
    const listadoReviews = await review.find({ producto: id }).populate('cliente').sort({ createdAt: -1 });

    res.status(200).send({
        datos: listadoReviews,
        resultadoExitoso: true,
        mensaje: 'Operación existosa!'
    });

}



// Se exportan todas las funcionalidades.
module.exports = {
    registroProducto,
    listarProductosFiltro,
    obtenerPortada,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto,
    listarInventarioProducto,
    eliminarInventarioProductoAdmin,
    registroInventario,
    actualizarVariedadesProducto,
    agregarImagenGaleria,
    eliminarImagenGaleria,
    listarProductosTienda,
    listarProductoSlug,
    listarProductosRecomendados,
    listarProductosNuevos,
    listarProductosMasVendidos,
    obtenerReviewsPublicoProducto
}