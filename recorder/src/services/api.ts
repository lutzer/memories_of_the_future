import _ from 'lodash'
import { config } from "../config"
import { ProjectSchema, StorySchema } from './storage'
import { getFilename } from '../utils/utils'

class ApiException extends Error {
  constructor(message: string) {
    super(message)
  }
}

async function uploadFiles(story: StorySchema) : Promise<Response> {
  var data = new FormData()
  data.append('recording', story.recording.blob, getFilename(story.recording.blob))
  data.append('image', story.image, getFilename(story.image))
  console.log([story.image, story.recording])

  let response = await fetch(config.apiAdress + 'upload/story/' + story.id, { // Your POST endpoint
    method: 'POST',
    body: data
  })
  return response
}

class Api {
  static async getProjectByName(name: string) : Promise<{project : ProjectSchema}> {
    let response = await fetch(config.apiAdress + 'projects?name=' + name)
    let json = await response.json()
    if (_.isEmpty(json.project))
      throw new ApiException(`There is no project with the name ${name}.`)
    return json
  }

  static async uploadStory(story: StorySchema) : Promise<void> {
    // post story
    let response = await fetch(config.apiAdress + 'stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(story)
    });

    if (response.status != 200) {
      let text = await response.text()
      throw new ApiException(text)
    }
    // find out story id from server
    let json = await response.json()
    story.id = json.story.id

    // upload files
    response = await uploadFiles(story) 
    if (response.status != 200) {
      let text = await response.text()
      throw new ApiException(text)
    }
  }
}

export { Api, ApiException }