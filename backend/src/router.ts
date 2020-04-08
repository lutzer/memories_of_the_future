import Koa from 'koa'
import bodyParser from 'koa-body'
import Router from 'koa-router'
import _ from 'lodash'

import { getDatabase } from './database'
import { DatabaseAdapter } from './database'
import { config } from './config'
import { ProjectModel } from './models/ProjectModel'
import { StoryModel } from './models/StoryModel'

const router = new Router({
  prefix : config.apiBasePath
})

router.get('/projects/', async (context) => {
  const db = await getDatabase()
  let projects : any[] = db.get('projects').value()
  // remove password from output
  projects = projects.map((val) => {
    delete val.password;
    return val
  })
  context.body = { projects : projects }
})

router.post('/projects/', bodyParser(), async (context) => {
  const db = await getDatabase()
  let project = new ProjectModel(context.request.body)
  if (project.validate()) {
    context.body = { project: project.data }
    db.get('projects').push(project.data).write()

  } else {
    context.throw(400,'Project data invalid.');
  }
})

router.get('/stories/', async (context) => {
  const db = await getDatabase()
  const stories = db.get('stories').value()
  context.body = { stories : stories }
})

router.post('/stories/', bodyParser(), async (context) => {
  const db = await getDatabase()
  let story = new StoryModel(context.request.body)
  // check if project with project id exists in database
  let project = db.get('projects').find({ id : story.data.projectId }).value()
  if (story.validate() && project) {
    context.body = { story: story.data }
    db.get('stories').push(story.data).write()
  } else {
    context.throw(400,'Story data invalid.');
  }
})

export { router }