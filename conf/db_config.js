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
// database.status = require('../models/status.js')(seq, Sequelize)
// database.priority = require('../models/priority.js')(seq, Sequelize)
// database.categories = require('../models/categories.js')(seq, Sequelize)
// database.tasks = require('../models/tasks.js')(seq, Sequelize)
// database.userRole = require('../models/userRole.js')(seq, Sequelize)
// database.miniNotes = require('../models/miniNotes.js')(seq, Sequelize)


database.initAssosciacion = () => {
  
  // database.user.hasMany(database.tasks, {
  //   foreignKey: "user_id",
  // });

  // database.tasks.belongsTo(database.user, {
  //   foreignKey: "user_id",
  // });

  // database.status.hasMany(database.tasks, {
  //   foreignKey: "status_id",
  // });

  // database.tasks.belongsTo(database.status, {
  //   foreignKey: "status_id",
  // });

  // database.priority.hasMany(database.tasks, {
  //   foreignKey: "priority_id",
  // });

  // database.tasks.belongsTo(database.priority, {
  //   foreignKey: "priority_id",
  // });

  // database.categories.hasMany(database.tasks, {
  //   foreignKey: "category_id",
  // });

  // database.tasks.belongsTo(database.categories, {
  //   foreignKey: "category_id",
  // });

  // database.tasks.hasMany(database.miniNotes, {
  //   foreignKey: "task_id",
  // });

  // database.miniNotes.belongsTo(database.tasks, {
  //   foreignKey: "task_id",
  // });
}

module.exports = database;