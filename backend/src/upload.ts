import { promisify } from 'util'
import { exec } from 'child_process'
import _ from 'lodash'
import { deleteFile, moveFile, copyFile } from './utils'
import { config } from './config'
import { extname, parse } from 'path'
import Jimp from 'jimp'

const execCommand = promisify(exec)

type FileUpload = {
  type: string, 
  name: string, 
  path: string,
}

/* function converts a wav or ogg file to mp3 and return its path */
const convertToMp3 = async function(path : string, extension : string = null) : Promise<string> {
  const fileData = parse(path)
  extension = extension || fileData.ext
  if (!_.includes(['.wav','.ogg','.webm'], extension))
    throw new Error("Extension not supported")
    
  const newPath = fileData.dir + '/' + fileData.name + '.mp3'
  await execCommand(`ffmpeg -f ${extension.substr(1)} -i ${path}  -acodec libmp3lame -y ${newPath}`)
  return newPath
}

const compressImage = async function(path : string, newPath : string) : Promise<void> {
  const image = await Jimp.read(path)
  const height = image.getHeight()
  const width = image.getWidth()
  // resize Image
  if (height > width)
    await image.resize(width/height*config.imageMaxSideSize, config.imageMaxSideSize);
  else
    await image.resize(config.imageMaxSideSize, height/width * config.imageMaxSideSize);
  await image.quality(config.imageQuality);
  await image.writeAsync(newPath);
}

async function handleImageUpload(file: FileUpload, filename: string) : Promise<string> {
  if (!_.includes(['.gif','.png','.jpg','.jpeg'], extname(file.name)))
    throw new Error('File format not supported')
  // const newPath = config.fileDirectory + '/' + storyId + '.jpg'
  // await compressImage(file.path, newPath)
  // move file
  const newPath = config.fileDirectory + '/' + filename + extname(file.name)
  await copyFile(file.path, newPath)
  await deleteFile(file.path)
  return newPath
}

async function handleAudioUpload(file: FileUpload, filename: string) : Promise<string> {
  if (!_.includes(['.mp3','.ogg','.wav','.webm'], extname(file.name)))
    throw new Error('File format not supported')

  var path = null
  if (extname(file.name) != '.mp3') {
    // convert to mp3
    path = await convertToMp3(file.path, extname(file.name))
    deleteFile(file.path)
  } else {
    path = file.path
  }
  
  // move file
  const newPath = config.fileDirectory + '/' + filename + '.mp3'
  await moveFile(path, newPath)
  return newPath
}

function getFileUrl(path : string = '') : string {
  const fileData = parse(path)
  return config.fileBasePath + '/' + fileData.base
}

export { FileUpload, convertToMp3, handleImageUpload, handleAudioUpload, getFileUrl }