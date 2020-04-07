import Koa from 'koa'
import serveStatic from 'koa-static'
import koaJson from 'koa-json'
import { getDatabase } from './database'

import { config } from './config'
import { router } from './router'



const app = new Koa()

// connect to database
app.context.db = getDatabase()

// if (process.env['DEVELOPMENT']) {
  const koaProxy = require('koa-proxy')

  // serve proxy during development
  app.use(koaProxy({
    host: config.frontendProxyUrl,
    match: /^(?!\/api\/)/
  }))
// } else {
//   // serve static files (web frontend)
//   app.use(serveStatic(config.staticDirectory))
// }

// enable pretty json response for development
app.use(koaJson())

// serve api routes
app.use(router.routes())

// start server
const server = app.listen(config.port, config.address);
const address = config.address + ":" + config.port

export { server, address }