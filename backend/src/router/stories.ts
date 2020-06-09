import bodyParser from 'koa-body'
import Router from '@koa/router'
import _ from 'lodash'

import { getDatabase } from './../database'
import { checkBasicAuth } from './../utils'
import { StoryModel } from './../models/StoryModel'

const router = new Router()

/* Story Routes */

router.get('/stories/', async (context) => {
  const db = await getDatabase()
  const stories = db.get('stories')
  if (_.has(context.request.query, 'project')) {
    context.body = { stories : stories.filter({projectId: context.request.query.project }).value() }
  } else
    context.body = { stories : stories.value() }
})

router.get('/stories/:id', async (context) => {
  const db = await getDatabase()
  context.body = { story : db.get('stories').find({ id : context.params.id })}
})

router.delete('/stories/:id', async (context) => {
  const db = await getDatabase()
  const story = db.get('stories').find({ id : context.params.id })
  if (story.isObject().value()) {
    db.get('stories').remove({ id : context.params.id }).write()
    context.body = { message: `Story ${context.params.id} removed.`}
  } else {
    context.throw(400, 'Story does not exist.');
  }
})

router.post('/stories/'/*?projectId*/, bodyParser(), async (context) => {
  const db = await getDatabase()
  const storyData = _.pick(context.request.body, ['author','projectId','location','text','createdAt'])
  let story = new StoryModel(storyData)
  // check if project with project id exists in database
  let project = db.get('projects').find({ id : story.data.projectId }).value()
  if (!project) {
    context.throw(400,'project does not exist.');
  } else if (!checkBasicAuth(context.header, project.name, project.password)) {
    context.throw(401,'No Authorization.');
  } else if (!story.validate() && project) {
    context.throw(400,'Story data invalid.');
  } else {
    context.body = { story: story.data }
    db.get('stories').push(story.data).write()
  }
})


export { router }