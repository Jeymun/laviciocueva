const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : null;
  const query = req.query.query || null;

  fs.readFile(path.join(__dirname, '../data/products.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo de productos');
    
    let products = JSON.parse(data);
    
    if (query) {
      products = products.filter(p => p.category === query || p.status.toString() === query);
    }
    
    if (sort !== null) {
      products.sort((a, b) => (a.price - b.price) * sort);
    }
    
    // 
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const paginatedProducts = products.slice((page - 1) * limit, page * limit);

    res.json({
      status: 'success',
      payload: paginatedProducts,
      totalPages: totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page: page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}` : null,
    });
  });
});
module.exports = router;
