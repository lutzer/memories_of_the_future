import Koa from 'koa'
import serveStatic from 'koa-static'
import koaJson from 'koa-json'
import koaProxy from 'koa-proxy'

import { config } from './config'
import { router } from './router'

const devMode = process.argv.includes('-dev')

const app = new Koa();

if (devMode) {
  // serve proxy during development
  app.use(koaProxy({
    host: config.frontendProxyUrl,
    match: /^(?!\/api\/)/
  }))
} else {
  // serve static files (web frontend)
  app.use(serveStatic(config.staticDirectory))
}

// enable pretty json response for development
app.use(koaJson())

// serve api routes
app.use(router.routes())


export { app, config }