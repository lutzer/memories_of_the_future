import bodyParser from 'koa-body'
import Router from '@koa/router'
import multer from '@koa/multer'
import _ from 'lodash'

import { getDatabase } from './database'
import { deleteFile, fileFilter, errorMiddleware, moveFile, checkBasicAuth } from './utils'
import { config } from './config'
import { ProjectModel } from './models/ProjectModel'
import { StoryModel } from './models/StoryModel'
import { handleAudioUpload, handleImageUpload, FileUpload, getFileUrl } from './upload'

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

class ApiError extends Error {
  statusCode : number
  constructor(statusCode : number, message : string) {
    super(message)
    this.statusCode = statusCode;
  }
}

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
  const projectData = _.pick(context.request.body, ['name','description','password'])
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

/* Upload Routes */

router.post('/upload/story/:id', errorMiddleware, upload.fields([
  { name: 'recording', maxCount: 1},
  { name: 'image', maxCount: 1}
]), async (context) => {
  const db = await getDatabase()
  const story = db.get('stories').find({id : context.params.id})
  const project = db.get('projects').find({id : story.get('projectId').value()}).value()
  
  // create list of uploaded files
  const uploadList = ['recording', 'image'].reduce( (acc, key) : FileUpload[] => {
    if (!_.has(context.request.files, key))
      return acc;
    const file : FileUpload = {
      type: key,
      name: context.request.files[key][0].originalname,
      path: context.request.files[key][0].path
    }
    return _.concat(acc, file)
  }, [])

  // story exists, handle file uploads
  try {
    if (!story.isObject().value() || !project) {
      throw new ApiError(400,'Story or Project does not exist');
    } else if (!checkBasicAuth(context.header, project.name, project.password)) {
      throw new ApiError(401,'Authorization required');
    } else {
      // convert and move files
      uploadList.forEach( (file) => {
        if (file.type == 'recording')
          handleAudioUpload(file, story.get('id').value())
          .catch((err) => {
            console.error("Error uploading file: " + file.name,err)
            deleteFile(file.path)
          }).then( (path : string) => {
            story.set('recording', getFileUrl(path)).write()
          })
        else if (file.type == 'image')
          handleImageUpload(file, story.get('id').value())
          .catch((err) => {
            console.error("Error uploading file: " + file.name,err)
            deleteFile(file.path)
          }).then( (path : string) => {
            story.set('image', getFileUrl(path)).write()
          })
      })
      context.body = { msg : `${uploadList.length} files uploaded to story ${story.get('id').value()}` }
    }
  } catch (err) {
    // cleanup files if there was en error
    await Promise.all(uploadList.map( async (file) => {
      await deleteFile(file.path)
    }))
    context.throw( err instanceof ApiError ? err.statusCode : 400, err.message)
  }
 
})


export { router }