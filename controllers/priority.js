const database = require('../conf/db_config')
const { Op } = require('sequelize')
const customOnError = require('./error')

function getPriority(req, res) {
    database.status
        .findAll({})
        .then((t) => res.json(t)).catch((e) => customError(req, res, e.name));
}

module.exports = {
  getPriority,
}