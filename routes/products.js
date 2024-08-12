const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: generarUUID } = require('uuid');

const rutaArchivoProductos = path.join(__dirname, '../data/products.json');

router.get('/', (req, res) => {
  const { limite } = req.query;
  fs.readFile(rutaArchivoProductos, 'utf8', (err, datos) => {
    if (err) return res.status(500).send('Error al leer el archivo de productos');
    let productos = JSON.parse(datos);
    if (limite) productos = productos.slice(0, parseInt(limite, 10));
    res.json(productos);
  });
});

router.get('/:idProducto', (req, res) => {
  const { idProducto } = req.params;
  fs.readFile(rutaArchivoProductos, 'utf8', (err, datos) => {
    if (err) return res.status(500).send('Error al leer el archivo de productos');
    const productos = JSON.parse(datos);
    const producto = productos.find(p => p.id === idProducto);
    if (!producto) return res.status(404).send('Producto no encontrado');
    res.json(producto);
  });
});

router.post('/', (req, res) => {
  const productoNuevo = { ...req.body, id: generarUUID(), estado: true };
  fs.readFile(rutaArchivoProductos, 'utf8', (err, datos) => {
    if (err) return res.status(500).send('Error al leer el archivo de productos');
    const productos = JSON.parse(datos);
    productos.push(productoNuevo);
    fs.writeFile(rutaArchivoProductos, JSON.stringify(productos, null, 2), (err) => {
      if (err) return res.status(500).send('Error al guardar el producto');
      req.app.get('io').emit('actualizarProductos', productos);
      res.status(201).json(productoNuevo);
    });
  });
});

router.put('/:idProducto', (req, res) => {
  const { idProducto } = req.params;
  const productoActualizado = req.body;
  fs.readFile(rutaArchivoProductos, 'utf8', (err, datos) => {
    if (err) return res.status(500).send('Error al leer el archivo de productos');
    let productos = JSON.parse(datos);
    productos = productos.map(p => (p.id === idProducto ? { ...p, ...productoActualizado } : p));
    fs.writeFile(rutaArchivoProductos, JSON.stringify(productos, null, 2), (err) => {
      if (err) return res.status(500).send('Error al guardar el producto');
      req.app.get('io').emit('actualizarProductos', productos);
      res.json({ id: idProducto, ...productoActualizado });
    });
  });
});

router.delete('/:idProducto', (req, res) => {
  const { idProducto } = req.params;
  fs.readFile(rutaArchivoProductos, 'utf8', (err, datos) => {
    if (err) return res.status(500).send('Error al leer el archivo de productos');
    let productos = JSON.parse(datos);
    productos = productos.filter(p => p.id !== idProducto);
    fs.writeFile(rutaArchivoProductos, JSON.stringify(productos, null, 2), (err) => {
      if (err) return res.status(500).send('Error al guardar el producto');
      req.app.get('io').emit('actualizarProductos', productos);
      res.status(204).send();
    });
  });
});

module.exports = router;
