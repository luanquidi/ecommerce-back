'use strict'

// Se declaran modulos.
const express = require('express');
const productoController = require('../controllers/ProductoController');

// Se establece el router.
const api = express.Router();
const auth = require('../middlewares/authenticate');
const multyParty = require('connect-multiparty');
const path = multyParty({
    uploadDir: './uploads/productos'
})

// PRODUCTOS
api.post('/registroProducto', [auth.auth, path], productoController.registroProducto);
api.get('/listarProductos/:filtro?', auth.auth, productoController.listarProductosFiltro);
api.get('/listarProductosAdmin/:tipo?/:filtro?', auth.auth, productoController.listarProductosFiltroAdmin);
api.put('/actualizarProducto/:id', [auth.auth, path], productoController.actualizarProducto);
api.delete('/eliminarProducto/:id', auth.auth, productoController.eliminarProducto);
api.get('/obtenerPortada/:img', productoController.obtenerPortada);
api.get('/obtenerProducto/:id', productoController.obtenerProducto);
api.put('/actualizarVariedadesProducto/:id', auth.auth, productoController.actualizarVariedadesProducto);
api.put('/agregarImagenGaleria/:id', [auth.auth, path], productoController.agregarImagenGaleria);
api.put('/eliminarImagenGaleria/:id', auth.auth, productoController.eliminarImagenGaleria);

// PRODUCTOS PUBLICOS
api.get('/listarProductosTienda/:filtro?', productoController.listarProductosTienda);
api.get('/listarProductoSlug/:slug', productoController.listarProductoSlug);
api.get('/listarProductosRecomendados/:categoria', productoController.listarProductosRecomendados);
api.get('/listarProductosNuevos', productoController.listarProductosNuevos);
api.get('/listarProductosMasVendidos', productoController.listarProductosMasVendidos);
api.get('/obtenerReviewsPublicoProducto/:id', productoController.obtenerReviewsPublicoProducto);





// INVENTARIO
api.get('/listarInventarioProducto/:id', auth.auth, productoController.listarInventarioProducto);
api.delete('/eliminarInventarioProductoAdmin/:id', auth.auth, productoController.eliminarInventarioProductoAdmin);
api.post('/registroInventario', auth.auth, productoController.registroInventario);




// Se exporta modulo.
module.exports = api;