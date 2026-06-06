const express = require('express')
const control = require('../controllers/controllers')
const route = express.Router()

route.get('/getUsers', control.user.getUser);
route.post('/signIn' , control.user.signIn);

module.exports = route;