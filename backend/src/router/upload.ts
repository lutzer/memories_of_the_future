import Router from '@koa/router'
import multer from '@koa/multer'
import _ from 'lodash'

import { getDatabase } from './../database'
import { deleteFile, fileFilter, errorMiddleware, moveFile, checkBasicAuth } from './../utils'
import { config } from './../config'
import { handleAudioUpload, handleImageUpload, FileUpload, getFileUrl } from './../upload'
import { ApiError } from './../exceptions'
import { AppContext } from '../app'

const router = new Router()

const upload = multer({
  dest: config.uploadTmpDirectory,
  limits: {
    fileSize: config.uploadMaxFilesize,
    files: 2
  },
  fileFilter : fileFilter
});

/* Upload Routes */

router.post('/upload/story/:id', errorMiddleware, upload.fields([
  { name: 'recording', maxCount: 1},
  { name: 'image', maxCount: 1}
]), async (context : AppContext) => {

  const uploadList = ['recording', 'image'].reduce( (acc, key) : FileUpload[] => {
    if (!_.has(context.request.files, key))
      return acc;
    return _.concat(acc, context.request.files[key][0].path)
  }, [])

  try {
    const db = await getDatabase()
    const story = db.get('stories').find({id : context.params.id}).value()
    if (!story)
      throw new ApiError(400,'Story does not exist')
    const project = db.get('projects').find({id : story.projectId}).value()
    if (!project)
      throw new ApiError(400,'Connected project does not exist')
      
    if (!checkBasicAuth(context.header, project.name, project.password))
        throw new ApiError(401,'Authorization required');

    // upload image
    if (_.has(context.request.files, 'image')) {
      const file : FileUpload = {
        type : 'image', 
        name : context.request.files.image[0].originalname,
        path: context.request.files.image[0].path
      }
      handleImageUpload(file, 'story_' + story.id).catch((err) => {
        console.error("Error uploading file: " + file.name,err)
        deleteFile(file.path)
      }).then( (path : string) => {
        db.get('stories').find({id : story.id}).set('image', getFileUrl(path)).write()
      })
    }

    //upload recording
    if (_.has(context.request.files, 'recording')) {
      const file : FileUpload = {
        type : 'recording', 
        name : context.request.files.recording[0].originalname,
        path: context.request.files.recording[0].path
      }
      handleAudioUpload(file, 'story_' + story.id)
      .catch((err) => {
        console.error("Error uploading file: " + file.name,err)
        deleteFile(file.path)
      }).then( (path : string) => {
        db.get('stories').find({id : story.id}).set('recording', getFileUrl(path)).write()
      })
    }

    context.body = { msg : `files uploaded to story ${story.id}` }
  } catch (err) {
    // cleanup files if there was en error
    await Promise.all(uploadList.map( async (path) => {
      await deleteFile(path)
    }))
    context.throw( err instanceof ApiError ? err.statusCode : 400, err.message)
  } 
})

router.post('/upload/attachment/:id', errorMiddleware, upload.fields([,
  { name: 'image', maxCount: 1}
]), async (context : AppContext) => {
  try {
    // get corresponding entries
    const db = await getDatabase()
    const attachment = db.get('attachments').find({id : context.params.id}).value()
    if (!attachment)
      throw new ApiError(400,'Attachment does not exist')
    const story = db.get('stories').find({ id: attachment.storyId }).value()
    if (!story)
      throw new ApiError(400,'Corresponding Story does not exist')
    const project = db.get('projects').find({id : story.projectId}).value()
    if (!project)
      throw new ApiError(400,'Corresponding Project does not exist')

    // check auth
    if (!checkBasicAuth(context.header, project.name, project.password))
      throw new ApiError(401,'Authorization required');

    const file : FileUpload = {
      type: 'image',
      name: context.request.files.image[0].originalname,
      path: context.request.files.image[0].path
    }

    // handle image file
    handleImageUpload(file, 'attachment_' + attachment.id).catch( (err) => {
      console.error("Error uploading file: " + file.name,err)
    }).then( (path: string) => {
      db.get('attachments').find({id : context.params.id}).set('image', getFileUrl(path)).write()
    })
    context.body = { msg : `image uploaded to attachment ${attachment.id}` }
  } catch (err) {
    context.throw( err instanceof ApiError ? err.statusCode : 400, err.message)
  }
  
});

export { router }