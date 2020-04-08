import Koa from 'koa'
import bodyParser from 'koa-body'
import Router from '@koa/router'
import multer from '@koa/multer'
import _ from 'lodash'

import { getDatabase } from './database'
import { deleteFile } from './utils'
import { config } from './config'
import { ProjectModel } from './models/ProjectModel'
import { StoryModel } from './models/StoryModel'

const router = new Router({
  prefix : config.apiBasePath
})

const upload = multer({
  dest: config.uploadTmpDirectory
});

/* Project Routes */

router.get('/projects/', async (context) => {
  const db = await getDatabase()
  const projects = db.get('projects').map((val) => {
    return _.omit(val, 'password')
  })
  context.body = { projects : projects.value() }
})

router.get('/projects/:id', async (context) => {
  const db = await getDatabase()
  const project = db.get('projects').find({ id : context.params.id }).value()
  context.body = { project : _.omit(project, 'password') }
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

router.post('/stories/'/*?projectId*/, bodyParser(), async (context) => {
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

/* Upload Routes */

router.post('/upload/story/:id', upload.fields([
  { name: 'recording', maxCount: 1},
  { name: 'image', maxCount: 1}
]), async (context) => {
  const db = await getDatabase()
  const story = db.get('stories').find({id : context.params.id}).value()
  const files = context.request.files
  var uploadList = []
  if (_.has(files, 'image')) {
    uploadList.push({ name: files.image[0].originalname, path: files.image[0].path })
  }
  if (_.has(files, 'recording')) {
    uploadList.push({ name: files.recording[0].originalname, path: files.recording[0].path })
  }
  // story exists, copy files to dir and update story
  if (story) {
    context.body = { uploads : uploadList }
  // story does not exist, remove files
  } else {
    await Promise.all(uploadList.map( async (val) => {
      await deleteFile(val.path)
    }))
    context.throw(400,'Story does not exist');
  }
  
})


export { router }