const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const productsFilePath = path.join(__dirname, '../data/products.json');

const getProducts = () => {
  const data = fs.readFileSync(productsFilePath);
  return JSON.parse(data);
};

const saveProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

router.get('/', (req, res) => {
  const limit = req.query.limit;
  let products = getProducts();
  if (limit) {
    products = products.slice(0, limit);
  }
  res.json(products);
});

router.get('/:pid', (req, res) => {
  const products = getProducts();
  const product = products.find(p => p.id === req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

router.post('/', (req, res) => {
  const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'All fields except thumbnails are required' });
  }
  const newProduct = {
    id: uuidv4(),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  };
  const products = getProducts();
  products.push(newProduct);
  saveProducts(products);
  res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === req.params.pid);
  if (productIndex !== -1) {
    const product = products[productIndex];
    products[productIndex] = {
      ...product,
      title: title !== undefined ? title : product.title,
      description: description !== undefined ? description : product.description,
      code: code !== undefined ? code : product.code,
      price: price !== undefined ? price : product.price,
      status: status !== undefined ? status : product.status,
      stock: stock !== undefined ? stock : product.stock,
      category: category !== undefined ? category : product.category,
      thumbnails: thumbnails !== undefined ? thumbnails : product.thumbnails
    };
    saveProducts(products);
    res.json(products[productIndex]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

router.delete('/:pid', (req, res) => {
  const products = getProducts();
  const newProducts = products.filter(p => p.id !== req.params.pid);
  if (newProducts.length !== products.length) {
    saveProducts(newProducts);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

module.exports = router;
