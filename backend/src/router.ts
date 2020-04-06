import Koa from 'koa'
import Router from 'koa-router'
import { DatabaseAdapter } from './database'

import { config } from './config'

interface ContextWithDb extends Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>> {
  db: DatabaseAdapter 
}

const router = new Router({
  prefix : config.apiBasePath
})

router.get('/projects/', async (ctx : ContextWithDb) => {
  const projects = ctx.db.get('projects').value()
  ctx.body = { projects : projects }
})

router.get('/stories/', async (ctx : ContextWithDb) => {
  const stories = ctx.db.get('stories').value()
  ctx.body = { msg : 'Stories'}
})

export { router }