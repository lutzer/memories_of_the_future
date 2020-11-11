import Koa from 'koa'
import koaJson from 'koa-json'
import cors from '@koa/cors'

import { config } from './config'
import { router } from './router'
import { connectSocket } from './socket'
import { Server } from 'http'
import serve from 'koa-static'
import mount  from 'koa-mount'

const devMode = process.argv.includes('-dev')

interface AppContext extends Koa.DefaultContext {
  io : SocketIO.Server
}

const app = new Koa<null,AppContext>();

if (devMode) {
  // enable pretty json response for development
  app.use(koaJson())
}

// enable cross origin access
app.use(cors());

// serve static routes
app.use(mount('/', serve(config.staticDirectory)))
app.use(mount('/files/', serve(config.fileDirectory)))

// serve api routes
app.use(router.routes())

function startServer() : Promise<Server> {
  return new Promise<Server>( (resolve) => {
    // start backend
    const server = app.listen(config.port, () => {
    app.context.io = connectSocket(server)
    resolve(server)
    })
  })
  
}

export { startServer, config, AppContext }