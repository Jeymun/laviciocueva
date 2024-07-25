const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: generarUUID } = require('uuid');

const rutaArchivoCarritos = path.join(__dirname, '../data/carts.json');

// Crear un nuevo carrito
router.post('/', (req, res) => {
  const carritoNuevo = { id: generarUUID(), productos: [] };
  fs.readFile(rutaArchivoCarritos, 'utf8', (err, datos) => {
    if (err) return res.status(500).send('Error al leer el archivo de carritos');
    const carritos = JSON.parse(datos);
    carritos.push(carritoNuevo);
    fs.writeFile(rutaArchivoCarritos, JSON.stringify(carritos, null, 2), (err) => {
      if (err) return res.status(500).send('Error al guardar el carrito');
      res.status(201).json(carritoNuevo);
    });
  });
});

module.exports = router;
