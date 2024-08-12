const express = require('express');
const { create } = require('express-handlebars');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const hbs = create({ extname: '.handlebars' });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

app.set('io', io);

const rutasProductos = require('./routes/products');
app.use('/api/products', rutasProductos);

const rutasCarritos = require('./routes/carts');
app.use('/api/carts', rutasCarritos);

app.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, 'data/products.json'), 'utf8', (err, datos) => {
    if (err) return res.status(500).send('Error al leer el archivo de productos');
    const productos = JSON.parse(datos);
    res.render('home', { productos });
  });
});

app.get('/realtimeproducts', (req, res) => {
  fs.readFile(path.join(__dirname, 'data/products.json'), 'utf8', (err, datos) => {
    if (err) return res.status(500).send('Error al leer el archivo de productos');
    const productos = JSON.parse(datos);
    res.render('realTimeProducts', { productos });
  });
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {});

  socket.on('nuevoProducto', (producto) => {
    fs.readFile(path.join(__dirname, 'data/products.json'), 'utf8', (err, datos) => {
      if (err) return;
      const productos = JSON.parse(datos);
      productos.push(producto);
      fs.writeFile(path.join(__dirname, 'data/products.json'), JSON.stringify(productos, null, 2), (err) => {
        if (err) return;
        io.emit('actualizarProductos', productos);
      });
    });
  });

  socket.on('eliminarProducto', (idProducto) => {
    fs.readFile(path.join(__dirname, 'data/products.json'), 'utf8', (err, datos) => {
      if (err) return;
      let productos = JSON.parse(datos);
      productos = productos.filter(p => p.id !== idProducto);
      fs.writeFile(path.join(__dirname, 'data/products.json'), JSON.stringify(productos, null, 2), (err) => {
        if (err) return;
        io.emit('actualizarProductos', productos);
      });
    });
  });
});

const PUERTO = 8080;
server.listen(PUERTO, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PUERTO}`);
});
