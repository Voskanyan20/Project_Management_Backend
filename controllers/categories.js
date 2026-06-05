const database = require('../conf/db_config')
const { Op } = require('sequelize')
const customOnError = require('./error')

function getCategories(req, res) {
    database.categories
        .findAll({})
        .then((t) => res.json(t)).catch((e) => customError(req, res, e.name));
}

module.exports = {
  getCategories,
}