const express = require('express')
const control = require('../controllers/controllers')
const route = express.Router()

route.get('/getCategories', control.categories.getCategories);

module.exports = route;