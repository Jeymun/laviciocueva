const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const cartsFilePath = path.join(__dirname, '../data/carts.json');

const getCarts = () => {
  const data = fs.readFileSync(cartsFilePath);
  return JSON.parse(data);
};

const saveCarts = (carts) => {
  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

router.post('/', (req, res) => {
  const newCart = {
    id: uuidv4(),
    products: []
  };
  const carts = getCarts();
  carts.push(newCart);
  saveCarts(carts);
  res.status(201).json(newCart);
});

module.exports = router;
