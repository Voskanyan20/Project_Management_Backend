const { Sequelize } = require('sequelize')
const { PGDATABASE, PGUSER, PGPASSWORD, PGHOST } = require('../configGlobal.js')

// const seq = new Sequelize(DB_NAME, DB_USERNAME, PASSWORD, {
//   host: HOST,
//   dialect: 'mysql'
// })

const seq = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
  host: PGHOST,
  dialect: "postgres",
  alias: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
  },
});

seq
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(error => {
    console.error('Unable to connect to the database: ', error)
  })

const database = {}

database.Sequelize = Sequelize
database.seq = seq
database.user = require('../models/users.js')(seq, Sequelize)
database.products = require('../models/products.js')(seq, Sequelize)
database.categories = require('../models/categories.js')(seq, Sequelize)
database.notes = require('../models/notes.js')(seq, Sequelize)
database.orders = require('../models/order.js')(seq, Sequelize)
database.orderItems = require('../models/orderItem.js')(seq, Sequelize)


database.initAssosciacion = () => {

  database.categories.hasMany(database.products, {
  foreignKey: 'category_id'
  });

  database.products.belongsTo(database.categories, {
    foreignKey: 'category_id'
  });

  database.orders.hasMany(database.orderItems, {
    foreignKey: 'order_id'
  });

  database.orderItems.belongsTo(database.orders, {
    foreignKey: 'order_id'
  });

  database.products.hasMany(database.orderItems, {
    foreignKey: 'product_id'
  });

  database.orderItems.belongsTo(database.products, {
    foreignKey: 'product_id'
  });
}

module.exports = database;