import bodyParser from 'koa-body'
import Router from '@koa/router'
import _ from 'lodash'

import { getDatabase } from './../database'
import { AttachmentModel } from './../models/AttachmentModel'
import { ApiError } from './../exceptions'
import { checkBasicAuth } from '../utils'

const router = new Router()

/* Story Routes */

router.get('/attachments/'/*?story*/, async (context) => {
  const db = await getDatabase()
  const attachments = db.get('attachments')
  if (_.has(context.request.query, 'story')) {
    context.body = { attachments : attachments.filter({storyId: context.request.query.story }).value() }
  } else
    context.body = { attachments : attachments.value() }
})

router.get('/attachments/:id', async (context) => {
  const db = await getDatabase()
  context.body = { attachment : db.get('attachments').find({ id : context.params.id })}
})

router.post('/attachments/'/*?storyId*/, bodyParser(), async (context) => {
  const db = await getDatabase()
  const attachmentData = _.pick(context.request.body, ['storyId','type','text'])
  let attachment = new AttachmentModel(attachmentData)
  // check if project with project id exists in database
  try {
    let story = db.get('stories').find({ id : attachment.data.storyId }).value()
    if (!story)
      throw new ApiError(400, 'Story does not exist')
    let project = db.get('projects').find({ id : story.projectId }).value()
    if (!project)
      throw new ApiError(400, 'Project does not exist') 
    if (!checkBasicAuth(context.header, project.name, project.password))
      throw new ApiError(401, 'No Authorization')
    if (!attachment.validate())
      throw new ApiError(400, 'Attahment data invalid')
    db.get('attachments').push(attachment.data).write()
    context.body = { attachment: attachment.data }
  } catch (err) {
    context.throw( err instanceof ApiError ? err.statusCode : 400, err.message)
  }
})

router.delete('/attachments/:id', async (context) => {
  const db = await getDatabase()
  const attachment = db.get('attachments').find({ id : context.params.id })
  if (attachment.isObject().value()) {
    db.get('attachments').remove({ id : context.params.id }).write()
    context.body = { message: `Attachment ${context.params.id} removed.`}
  } else {
    context.throw(400, 'Attachment does not exist.');
  }
})

export { router }