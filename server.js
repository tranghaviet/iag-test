const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// initial ID - works like auto increment in DB
let currentProductId = 1

const createProduct = (name, price) => {
  return {id: currentProductId++, name, price}
}

const products = [
  ['Cookies', 2.99],
  ['Bread', 2],
  ['Orange Juice', 5],
].map(e => createProduct(e[0], e[1]));

const addProduct = (name, price) => {
  const newProduct = createProduct(name, price)
  products.push(newProduct)
  return newProduct
}

// let currentOrderId = 1;
const orders = [];

const placeOrder = (id, quantity) => {
  const product = products.find(p => p.id === id)
  const subTotal = product.price * quantity;
  const order = {product, quantity, subTotal}
  orders.push(order)
  return order
}

// Product API
app.get('/products', (req, res) => {
  res.send(products);
});

app.post('/products', (req, res) => {
  // maybe we need to group the products by id
  const newProduct = addProduct(req.body.name, req.body.price);
  res.send(newProduct);
});

// Order API
app.post('/orders', (req, res) => {
  const groupedOrder = req.body.reduce((accumulator, currentValue) => {
    const existingItem = accumulator.find(item => item.id === currentValue.id);
    if (existingItem) {
      existingItem.quantity += currentValue.quantity;
    } else {
      accumulator.push({id: currentValue.id, quantity: currentValue.quantity});
    }
    return accumulator;
  }, []);

  const newGroupedOrder = groupedOrder.map(product => placeOrder(product.id, product.quantity));

  const total = Object.values(newGroupedOrder).reduce((acc, order) => {
    return acc + order.product.price * order.quantity
  }, 0);

  res.send({orders: newGroupedOrder, total});
});

if (process.env.NODE_ENV === 'production') {
  // Serve static files
  app.use(express.static(path.join(__dirname, 'frontend/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Server port: ${port}`));
