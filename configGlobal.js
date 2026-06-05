const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT
const DB_NAME = process.env.DB_DATABASE
const DB_USERNAME = process.env.DB_USER
const PASSWORD = process.env.DB_PASSWORD
const HOST = process.env.DB_SERVER

const { PGHOST , PGDATABASE , PGUSER , PGPASSWORD , PGSSLMODE , PGCHANNELBINDING } = process.env;

module.exports = {
  PORT,
  DB_NAME,
  DB_USERNAME,
  PASSWORD,
  HOST,
  PGHOST,
  PGDATABASE,
  PGUSER,
  PGPASSWORD,
  PGSSLMODE,
  PGCHANNELBINDING
}