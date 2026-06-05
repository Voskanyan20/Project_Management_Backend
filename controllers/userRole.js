const database = require('../conf/db_config')
const { Op } = require('sequelize')
const customOnError = require('./error')

function getRole(req, res) {
    database.userRole
        .findAll({})
        .then((t) => res.json(t)).catch((e) => customError(req, res, e.name));
}

module.exports = {
  getRole
}