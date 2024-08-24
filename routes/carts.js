const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.delete('/:cid/products/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  fs.readFile(path.join(__dirname, '../data/carts.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo de carritos');
    let carts = JSON.parse(data);
    const cart = carts.find(c => c.id === cartId);

    if (!cart) return res.status(404).send('Carrito no encontrado');
    cart.products = cart.products.filter(p => p.id !== productId);

    fs.writeFile(path.join(__dirname, '../data/carts.json'), JSON.stringify(carts, null, 2), (err) => {
      if (err) return res.status(500).send('Error al guardar el carrito');
      res.send('Producto eliminado del carrito');
    });
  });
});

router.put('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const products = req.body.products;

  fs.readFile(path.join(__dirname, '../data/carts.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo de carritos');
    let carts = JSON.parse(data);
    const cart = carts.find(c => c.id === cartId);

    if (!cart) return res.status(404).send('Carrito no encontrado');
    cart.products = products;

    fs.writeFile(path.join(__dirname, '../data/carts.json'), JSON.stringify(carts, null, 2), (err) => {
      if (err) return res.status(500).send('Error al guardar el carrito');
      res.send('Carrito actualizado');
    });
  });
});

router.put('/:cid/products/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  fs.readFile(path.join(__dirname, '../data/carts.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo de carritos');
    let carts = JSON.parse(data);
    const cart = carts.find(c => c.id === cartId);

    if (!cart) return res.status(404).send('Carrito no encontrado');
    const product = cart.products.find(p => p.id === productId);
    
    if (!product) return res.status(404).send('Producto no encontrado en el carrito');
    product.quantity = quantity;

    fs.writeFile(path.join(__dirname, '../data/carts.json'), JSON.stringify(carts, null, 2), (err) => {
      if (err) return res.status(500).send('Error al guardar el carrito');
      res.send('Cantidad de producto actualizada');
    });
  });
});

router.delete('/:cid', (req, res) => {
  const cartId = req.params.cid;

  fs.readFile(path.join(__dirname, '../data/carts.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo de carritos');
    let carts = JSON.parse(data);
    const cart = carts.find(c => c.id === cartId);

    if (!cart) return res.status(404).send('Carrito no encontrado');
    cart.products = [];

    fs.writeFile(path.join(__dirname, '../data/carts.json'), JSON.stringify(carts, null, 2), (err) => {
      if (err) return res.status(500).send('Error al guardar el carrito');
      res.send('Todos los productos eliminados del carrito');
    });
  });
});

module.exports = router;
