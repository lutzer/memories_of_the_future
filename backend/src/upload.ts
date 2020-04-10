import { promisify } from 'util'
import { exec } from 'child_process'
import _ from 'lodash'
import { getDatabase } from './database'
import { deleteFile, moveFile } from './utils'
import { config } from './config'
import { extname, parse } from 'path'

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
  if ( extension == '.mp3')
    return path
  if (!_.includes(['.wav','.ogg'], extension))
    throw new Error("Extension not supported")
    
  const newPath = fileData.dir + '/' + fileData.name + '.mp3'
  await execCommand(`ffmpeg -f ${extension.substr(1)} -i ${path}  -acodec libmp3lame -y ${newPath}`)
  return newPath
}

/* Upload Story Routes */

// converts audio file asynchronously after upload
// function convertAudio(file: string,  storyId: string) {
//   convertToMp3(path).catch( (err) => {
//     console.error(err)
//   }).then( async (newPath) => {
//     // update story
//     const db = await getDatabase()
//     const story = db.get('stories').find({id : storyId})
//     story.set('recording', newPath).write()
//     // delete old file
//     if (path != newPath) 
//       await deleteFile(path)
//   })
// }

async function handleImageUpload(file: FileUpload, storyId: string) : Promise<string> {
  if (!_.includes(['.gif','.png','jpg','jpeg'], extname(file.name)))
    throw new Error('File format not supported')
  // move file
  const newPath = config.fileDirectory + '/' + storyId + extname(file.name)
  await moveFile(file.path, newPath)
  return newPath
}

async function handleAudioUpload(file: FileUpload, storyId: string) : Promise<string> {
  if (!_.includes(['.mp3','.ogg','.wav'], extname(file.name)))
    throw new Error('File format not supported')
  // convert to mp3
  const path = await convertToMp3(file.path, extname(file.name))
  // delete old file
  if (path != file.path)
    deleteFile(file.path)
  // move file
  const newPath = config.fileDirectory + '/' + storyId + extname(path)
  await moveFile(path, newPath)
  return newPath
}

export { FileUpload, convertToMp3, handleImageUpload, handleAudioUpload }