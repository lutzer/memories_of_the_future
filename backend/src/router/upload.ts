import Router from '@koa/router'
import multer from '@koa/multer'
import _ from 'lodash'

import { getDatabase } from './../database'
import { deleteFile, fileFilter, errorMiddleware, moveFile, checkBasicAuth } from './../utils'
import { config } from './../config'
import { handleAudioUpload, handleImageUpload, FileUpload, getFileUrl } from './../upload'
import { ApiError } from './../exceptions'
import { StoryModelSchema } from '../models/StoryModel'

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