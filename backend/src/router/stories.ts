import bodyParser from 'koa-body'
import Router from '@koa/router'
import _ from 'lodash'

import { DatabaseAdapter, getDatabase } from './../database'
import { checkBasicAuth, deleteFile } from './../utils'
import { StoryModel, StoryModelSchema } from './../models/StoryModel'
import { ApiError } from '../exceptions'

const router = new Router()

/* Story Routes */

function joinAttachments(story : StoryModelSchema, db: DatabaseAdapter) {
  const attachments = db.get('attachments').filter({ storyId : story.id }).value()
  return Object.assign({}, story, { attachments : attachments || []} )
}

router.get('/stories/', async (context) => {
  const db = await getDatabase()
  if (_.has(context.request.query, 'project')) {
    const stories = db.get('stories').filter({ projectId: context.request.query.project }).value()
    context.body = { stories : stories.map( (s) => joinAttachments(s, db)) }
  } else {
    const stories = db.get('stories').value()
    context.body = { stories : stories.map( (s) => joinAttachments(s, db)) }
  }
})

router.get('/stories/:id', async (context) => {
  const db = await getDatabase()
  const story = db.get('stories').find({ id : context.params.id }).value()
  context.body = { story : joinAttachments(story, db)}
})

router.delete('/stories/:id', async (context) => {
  const db = await getDatabase()
  const story = db.get('stories').find({ id : context.params.id }).value()
  // get corresponding project
  try {
    if (!story)
      throw new ApiError(400, 'Story does not exist.');
    const project = db.get('projects').find({ id : story.projectId }).value()
    if (project && !checkBasicAuth(context.header, project.name, project.password))
      throw new ApiError(401,'No Authorization.');
    if (story.image)
      deleteFile(story.image)
    if (story.recording)
      deleteFile(story.recording)
    db.get('stories').remove({ id : context.params.id }).write()
    context.body = { message: `Story ${context.params.id} removed.`}
  } catch (err) {
    context.throw( err instanceof ApiError ? err.statusCode : 400, err.message)
  }
})

router.post('/stories/'/*?projectId*/, bodyParser(), async (context) => {
  const db = await getDatabase()
  const storyData = _.pick(context.request.body, ['author','projectId','location','text','title','createdAt'])
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