const express = require('express')
const control = require('../controllers/controllers')
const route = express.Router()

route.get("/getOrders", control.orders.getOrders);
route.post("/createOrders" , control.orders.createOrders);
route.put("/updateOrder/:id", control.orders.updateOrders);
route.delete("/deleteOrder/:id", control.orders.deleteOrders);

module.exports = route;