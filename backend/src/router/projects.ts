import bodyParser from 'koa-body'
import Router from '@koa/router'
import _ from 'lodash'

import { getDatabase } from './../database'
import { ProjectModel } from './../models/ProjectModel'
import { config } from '../config'
import { checkBasicAuth } from '../utils'
import { ApiError } from '../exceptions'

const router = new Router()

/* Project Routes */

router.get('/projects/', async (context) => {
  const db = await getDatabase()
  if (_.has(context.request.query, 'name')) {
    const project = db.get('projects').find(({name}) => {
      return name.toLowerCase() == context.request.query.name.toLowerCase()
    })
    context.body = { project : _.omit(project.value(), 'password') }
  } else {
    const projects = db.get('projects').map((val) => {
      return _.omit(val, 'password')
    })
    context.body = { projects : projects.value() }
  }
})

router.get('/projects/:id', async (context) => {
  const db = await getDatabase()
  const project = db.get('projects').find({ id : context.params.id })
  context.body = { project : _.omit(project.value(), 'password') }
})

router.delete('/projects/:id', async (context) => {
  const db = await getDatabase()
  const project = db.get('projects').find({ id : context.params.id }).value()
  try {
    if (!checkBasicAuth(context.header, config.adminLogin, config.adminPassword))
      throw new ApiError(401, 'No Authorization')  
    if (!project)
      throw new ApiError(400, 'project does not exist.');
    db.get('projects').remove({ id : context.params.id }).write()
    context.body = { message: `Project ${context.params.id} removed.`}
  } catch (err) {
    context.throw( err instanceof ApiError ? err.statusCode : 400, err.message)
  }
})

router.post('/projects/', bodyParser(), async (context) => {
  try {
    if (!checkBasicAuth(context.header, config.adminLogin, config.adminPassword))
      throw new ApiError(401, 'No Authorization')  
    const db = await getDatabase()
    const projectData = _.pick(context.request.body, ['name','description','password','color'])
    let project = new ProjectModel(projectData)
    // check if project with this name already exists
    let nameExists = db.get('projects').find({ name : project.data.name}).isObject().value()
    if (!project.validate() || nameExists)
      throw  new ApiError(400,'Project data invalid.');
    context.body = { project: project.data }
    db.get('projects').push(project.data).write()
  } catch (err) {
    context.throw( err instanceof ApiError ? err.statusCode : 400, err.message)
  }
})


export { router }