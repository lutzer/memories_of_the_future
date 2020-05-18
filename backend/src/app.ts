import Koa from 'koa'
import serveStatic from 'koa-static'
import koaJson from 'koa-json'
import koaProxy from 'koa-proxy'
import cors from '@koa/cors';

import { config } from './config'
import { router } from './router'
import { staticRouter } from './staticRouter'

const devMode = process.argv.includes('-dev')

const app = new Koa();

if (devMode) {
  // serve proxy during development
  app.use(koaProxy({
    host: config.frontendProxyUrl,
    match: /^(?!(\/api\/)|(\/files\/))/
  }))
  // enable pretty json response for development
  app.use(koaJson())
}

// enable cross origin access
app.use(cors());

// serve static routes
app.use(staticRouter.routes())

// serve api routes
app.use(router.routes())

export { app, config }