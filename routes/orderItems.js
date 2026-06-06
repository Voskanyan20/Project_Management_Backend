const express = require('express')
const control = require('../controllers/controllers')
const route = express.Router()

route.get('/getOrderItems', control.orderItems.getOrderItems);
route.post('/createOrderItems' , control.orderItems.createOrderItems);
route.put("/updateOrderItem/:id", control.orderItems.updateOrderItems);
route.delete("/deleteOrderItem/:id", control.orderItems.deleteOrderItems);

module.exports = route;