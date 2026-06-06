const express = require('express')
const control = require('../controllers/controllers')
const route = express.Router()

route.get('/getProducts', control.products.getProducts);
route.get('/getRestockProducts', control.products.getRestockProducts);
route.post('/createProducts' , control.products.createProducts);
route.put("/updateProduct/:id", control.products.updateProducts);
route.delete("/deleteProduct/:id", control.products.deleteProducts);

module.exports = route;