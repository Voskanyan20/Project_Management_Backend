const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const database = require('./conf/db_config.js')
const RateLimit = require('express-rate-limit')
const http = require('http')


database.initAssosciacion()
const { ensureProductTypeColumn, ensureJsonColumns } = require('./utils/ensureSchema')

database.seq
  .sync({ force: false, alter: true })
  .then(() => ensureProductTypeColumn())
  .then(() => ensureJsonColumns())
  .then(() => {
    console.log('sync')
  })
  .catch(error => {
    console.log(error)
  })

const router = require('./routes/router.js');
const { PORT } = require('./configGlobal.js')

const apiLimiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 4000
})

app.use(cors())
app.use(apiLimiter)
app.use(bodyParser.json())

app.use(
  '/', 
  router.routeUser,
  router.routeCategories,
  router.routeProducts,
  router.routerNotes,
  router.routerOrders,
  router.routerItems
);

app.listen(PORT, () => console.log(`Server started with ${PORT} port`))