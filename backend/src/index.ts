import Koa from 'koa'
import koaJson from 'koa-json'
import serveStatic from 'koa-static'
import { getDatabase } from './database'

import { config } from './config'
import { router } from './router'

const app = new Koa()

// connect to database
app.context.db = getDatabase()

// serve static files (web frontend)
app.use(serveStatic(config.staticDirectory))

// enable pretty json response for development
app.use(koaJson())

// serve api routes
app.use(router.routes())

// start server
const server = app.listen(config.port);
console.info(`Server started on ${config.port}`)

export { server }