const express = require('express')
const control = require('../controllers/controllers')
const route = express.Router()

route.get('/userRole', control.userRole.getRole);

module.exports = route;