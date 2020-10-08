import bodyParser from 'koa-body'
import Router from '@koa/router'
import _ from 'lodash'

import { getDatabase } from './../database'
import { ProjectModel } from './../models/ProjectModel'

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

router.post('/projects/', bodyParser(), async (context) => {
  const db = await getDatabase()
  const projectData = _.pick(context.request.body, ['name','description','password','color'])
  let project = new ProjectModel(projectData)
  // check if project with this name already exists
  let nameExists = db.get('projects').find({ name : project.data.name}).isObject().value()
  if (project.validate() && !nameExists) {
    context.body = { project: project.data }
    db.get('projects').push(project.data).write()
  } else {
    context.throw(400,'Project data invalid.');
  }
})


export { router }