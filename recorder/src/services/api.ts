import _ from 'lodash'
import { config } from "../config"
import { getFilename, generateAuthHeader } from '../utils/utils'
import { RecordSchema, StorySchema, ProjectSchema, AttachmentSchema } from './store'


class ApiException extends Error {

  statusCode : number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

async function uploadFiles(id: string, story: RecordSchema, password: string, controller?: AbortController) : Promise<Response> {
  var data = new FormData()
  data.append('recording', story.recording.blob, getFilename(story.recording.blob))
  data.append('image', story.image, getFilename(story.image))

  let response = await fetch(config.apiAdress + 'upload/story/' + id, {
    method: 'POST',
    headers: new Headers( generateAuthHeader(story.projectName, password)),
    body: data,
    signal: controller ? controller.signal : null
  })
  return response
}

class Api {

  static async getStoriesByProjectId(id : string) : Promise<{stories : StorySchema[]}> {
    let response = await fetch(config.apiAdress + 'stories/?project=' + id)
    if (response.status != 200)
      throw new ApiException(response.status, `Could not fetch data.`)
    let json = await response.json()
    return json
  }

  static async getProjectByName(name: string) : Promise<{project : ProjectSchema}> {
    let response = await fetch(config.apiAdress + 'projects?name=' + name)
    if (response.status != 200)
      throw new ApiException(response.status, `Could not fetch data.`)
    let json = await response.json()
    if (_.isEmpty(json.project))
      throw new ApiException(response.status, `There is no project with the name ${name}.`)
    return json
  }

  static async uploadStory(record: RecordSchema, password: string, controller?: AbortController) : Promise<string> {
    
    // post story
    let response = await fetch(config.apiAdress + 'stories', {
      method: 'POST',
      headers: Object.assign({},{
        'Content-Type': 'application/json'
      }, generateAuthHeader(record.projectName, password)),
      body: JSON.stringify(record),
      signal: controller ? controller.signal : null
    });

    if (response.status != 200) {
      let text = await response.text()
      throw new ApiException(response.status, text)
    }
    // find out story id from server
    let json = await response.json()
    let serverId = json.story.id

    // upload files
    response = await uploadFiles(serverId, record, password, controller) 
    if (response.status != 200) {
      let text = await response.text()
      throw new ApiException(response.status, text)
    }
    //return new id
    return serverId
  }

  static async addAttachment(attachment : AttachmentSchema, password: string, projectName: string) {
    // post story
    let response = await fetch(config.apiAdress + 'attachments', {
      method: 'POST',
      headers: Object.assign({},{
        'Content-Type': 'application/json'
      }, generateAuthHeader(projectName, password)),
      body: JSON.stringify(attachment)
    });
    if (response.status != 200) {
      let text = await response.text()
      throw new ApiException(response.status, text)
    }
  }
}

export { Api, ApiException }