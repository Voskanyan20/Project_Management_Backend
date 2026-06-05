const express = require('express')
const control = require('../controllers/controllers')
const route = express.Router()

route.get('/getStatus', control.status.getStatus);

module.exports = route;