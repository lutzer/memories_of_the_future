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

router.get('/projects/', async (context : KoaCtxWIdthDb) => {
  let projects : any[] = context.db.get('projects').value()
  // remove password from output
  projects = projects.map((val) => {
    delete val.password;
    return val
  })
  context.body = { projects : projects }
})

router.post('/projects/', bodyParser(), async (context : KoaCtxWIdthDb) => {
  let project = new ProjectModel(context.request.body)
  if (project.validate()) {
    context.body = { project: project.data }
    const db : any = context.db
    db.get('projects').push(project.data).write()

  } else {
    context.throw(400,'Project data invalid.');
  }
})

router.get('/stories/', async (context : KoaCtxWIdthDb) => {
  const stories = context.db.get('stories').value()
  context.body = { stories : stories }
})

router.post('/stories/', bodyParser(), async (context : KoaCtxWIdthDb) => {
  let story = new StoryModel(context.request.body)
  let projects = context.db.get('projects')
  if (story.validate()/* && _.find(projects, { id : story.data.projectId })*/) {
    context.body = { story: story.data }
    const db : any = context.db
    db.get('stories').push(story.data).write()
  } else {
    context.throw(400,'Story data invalid.');
  }
})

export { router }