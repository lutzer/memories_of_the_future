import Koa from 'koa'
import bodyParser from 'koa-body'
import Router from '@koa/router'
import multer from '@koa/multer'
import _ from 'lodash'
import { extname } from 'path'

import { getDatabase } from './database'
import { deleteFile, fileFilter, errorMiddleware, moveFile } from './utils'
import { config } from './config'
import { ProjectModel } from './models/ProjectModel'
import { StoryModel } from './models/StoryModel'

const router = new Router({
  prefix : config.apiBasePath
})

const upload = multer({
  dest: config.uploadTmpDirectory,
  limits: {
    fileSize: config.uploadMaxFilesize,
    files: 2
  },
  fileFilter : fileFilter
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

router.post('/upload/story/:id', errorMiddleware, upload.fields([
  { name: 'recording', maxCount: 1},
  { name: 'image', maxCount: 1}
]), async (context) => {
  const db = await getDatabase()
  const story = db.get('stories').find({id : context.params.id}).value()
  const files = context.request.files
  
  const uploadList = Object.keys(files).map( (key) => {
    const file = files[key]
    let newPath = story ? config.fileDirectory + '/' + story.id  + '.' + extname(file[0].originalname) : ''
    return { name: file[0].originalname, tmpPath: file[0].path, path: newPath }
  })


  // story exists, move files to dir and update story
  if (story) {
    await Promise.all(uploadList.map( async (val) => {
      await moveFile(val.tmpPath, val.path)
    }))
    context.body = { uploads : uploadList }
  // story does not exist, remove files
  } else {
    await Promise.all(uploadList.map( async (val) => {
      await deleteFile(val.tmpPath)
    }))
    context.throw(400,'Story does not exist');
  }
  
})


export { router }