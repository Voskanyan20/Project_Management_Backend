const express = require('express')
const control = require('../controllers/controllers')
const route = express.Router()

route.get('/getCategories', control.categories.getCategories);
route.post('/createCategories' , control.categories.createCategories);
route.put("/updateCategorie/:id", control.categories.updateCategories);
route.delete("/deleteCategorie/:id", control.categories.deleteCategories);

module.exports = route;