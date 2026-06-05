const express = require('express')
const control = require('../controllers/controllers')
const route = express.Router()

route.get('/getPriority', control.priority.getPriority);


module.exports = route;