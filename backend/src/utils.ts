import fs from 'fs'
import { promisify } from 'util'
import Koa from 'koa'
import _ from 'lodash'

const existsPath = promisify(fs.exists)

const deleteFile = promisify(fs.unlink)

const moveFile = promisify(fs.rename)

const copyFile = promisify(fs.copyFile)

const fileFilter = function (req, file, cb) {

  // fix for ios safari recordings
  if (file.mimetype == 'audio/mp4') {
    file.originalname = 'recording.mp4'
  }

  // accept image and sound files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp3|wav|ogg|webm|m4a|mp4)$/)) {
      return cb(new Error('Only (jpg|jpeg|png|gif|mp3|wav|ogg|m4a|mp4) are allowed!'), false);
  }
  cb(null, true);
};

const errorMiddleware = async function(context : Koa.BaseContext, next : Koa.Next) {
  try {
    await next()
  } catch (err) {
    context.throw(400, err);
  }
}

const checkBasicAuth = function(header : any, name: string, password: string) : boolean {
  if (!_.has(header,'authorization'))
    return false;
  let hash = 'Basic ' + Buffer.from(name+':'+password).toString('base64')
  return header.authorization == hash
}

const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15).toUpperCase();
}

export { 
  deleteFile, 
  moveFile, 
  existsPath, 
  copyFile,
  fileFilter, 
  errorMiddleware, 
  generateRandomString,
  checkBasicAuth
}