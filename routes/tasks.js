const express = require('express')
const control = require('../controllers/controllers')
const route = express.Router()

route.post('/getTasks', control.tasks.getTasks);
route.post('/createTasks' , control.tasks.createTasks);
route.put("/updateTasks/:id", control.tasks.updateTasks);
route.delete("/deleteTasks/:id", control.tasks.deleteTasks);

module.exports = route;