const express = require('express')
const control = require('../controllers/controllers')
const route = express.Router()

route.post('/createNotes' , control.notes.createNotes);
route.get('/getNotes', control.notes.getNotes);
route.put("/updateNote/:id", control.notes.updateNotes);
route.delete("/deleteNote/:id", control.notes.deleteNotes);

module.exports = route;