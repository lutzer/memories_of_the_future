import Koa from 'koa'
import bodyParser from 'koa-body'
import Router from 'koa-router'
import _ from 'lodash'

import { DatabaseAdapter } from './database'
import { config } from './config'
import { ProjectModel } from './models/ProjectModel'
import { StoryModel } from './models/StoryModel'

interface KoaCtxWIdthDb extends Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>> {
  db: DatabaseAdapter 
}

const router = new Router({
  prefix : config.apiBasePath
})

router.get('/projects/', async (ctx : KoaCtxWIdthDb) => {
  const projects = ctx.db.get('projects').value()
  ctx.body = { projects : projects }
})

router.post('/projects/', bodyParser(), async (ctx : KoaCtxWIdthDb) => {
  let project = new ProjectModel(ctx.request.body)
  if (project.validate()) {
    ctx.body = { project: project.data }
    ctx.db.get('projects').add(project.data)
  } else {
    ctx.throw(400,'Project data invalid.');
  }
})

router.get('/stories/', async (ctx : KoaCtxWIdthDb) => {
  const stories = ctx.db.get('stories').value()
  ctx.body = { msg : 'Stories'}
})

router.post('/stories/', bodyParser(), async (ctx : KoaCtxWIdthDb) => {
  let story = new StoryModel(ctx.request.body)
  let projects = ctx.db.get('projects')
  // check if id exists in project array
  if (story.validate() && _.find(projects, { id : story.data.projectId })) {
    ctx.body = { story: story.data }
    ctx.db.get('stories').add(story.data)
  } else {
    ctx.throw(400,'Story data invalid.');
  }
})

export { router }