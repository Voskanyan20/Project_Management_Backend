const express = require('express')
const control = require('../controllers/controllers')
const route = express.Router()

route.post('/createMiniNote' , control.miniNotes.createMiniNote);
route.get('/getTaskMiniNotes/:task_id', control.miniNotes.getTaskMiniNotes);
route.put("/updateMiniNote/:id", control.miniNotes.updateMiniNote);
route.delete("/deleteMiniNote/:id", control.miniNotes.deleteMiniNote);

module.exports = route;