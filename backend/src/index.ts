import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as koaJson from 'koa-json'
import * as serveStatic from 'koa-static'

import { config } from './config'

const app = new Koa()
const api = new Router({
  prefix : config.apiBasePath
})

api.get('/projects/', async (ctx) => {
  ctx.body = { msg : 'Projects'}
})

api.get('/stories/', async (ctx) => {
  ctx.body = { msg : 'Stories'}
})

// serve static files
app.use(serveStatic(config.staticDirectory))

app.use(koaJson())
app.use(api.routes())

const server = app.listen(config.port);
console.info(`Server started on ${config.port}`)

export { server }