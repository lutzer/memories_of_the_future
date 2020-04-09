import fs from 'fs'
import { promisify } from 'util'
import Koa from 'koa'
import { exec } from 'child_process'
import { parse } from 'path'
import _ from 'lodash'

const existsPath = promisify(fs.exists)

const deleteFile = promisify(fs.unlink)

const moveFile = promisify(fs.rename)

const execCommand =promisify(exec)

/* function converts a wav or ogg file to mp3 and return its path */
const convertToMp3 = async function(path : string) : Promise<string> {
  const fileData = parse(path)
  if (fileData.ext == '.mp3')
    return path
  if (!_.includes(['.wav','.ogg'], fileData.ext))
    throw new Error("Extension not supported")
    
  const newPath = fileData.dir + '/' + fileData.name + '.mp3'
  await execCommand(`ffmpeg -i ${path} -acodec libmp3lame -y ${newPath}`)
  return newPath
}

const fileFilter = function (req, file, cb) {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp3|wav|ogg)$/)) {
      return cb(new Error('Only image and sound files are allowed!'), false);
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

const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export { 
  deleteFile, 
  moveFile, 
  existsPath, 
  fileFilter, 
  errorMiddleware, 
  generateRandomString, 
  convertToMp3 
}