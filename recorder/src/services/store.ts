import { Api } from "./api"
import { getDatabase } from "./storage"
import { AudioRecording } from "../media/recorder"
import _ from "lodash"

type RecordSchema = {
  id: string,
  projectId : string,
  projectName? : string,
  createdAt: number,
  author?: string,
  modifiedAt?: number,
  text?: string,
  recording?: AudioRecording,
  image? : Blob,
  location? : [ number, number ],
  uploaded : boolean
}

type ProjectSchema = {
  id: string,
  name : string,
  description: string,
  createdAt: number
}

type StorySchema = {
  id: string,
  projectId : string,
  createdAt: number,
  author: string,
  text: string,
  recording: string,
  image : string,
  location : [ number, number ],
  visible: boolean
}

class StoreException extends Error {

  constructor(message: string) {
    super(message)
  }
}


class Store {

  static async getProject(name : string) : Promise<ProjectSchema> {
    // get project from db
    const db = await getDatabase()
    var project = await db.getProject()

    // check if the project has the same name
    project = (project && project.name == name) ? project : null
    
    // get project from api
    try {
      const data = await Api.getProjectByName(name)
      project = data.project
    } finally {
      return project
    }
  }

  static async getCurrentProject() : Promise<ProjectSchema> {
    // get project from db
    const db = await getDatabase()
    var project = await db.getProject()
    
    // get project from api
    try {
      const data = await Api.getProjectByName(project.name)
      project = data.project
    } finally {
      return project
    }
  }

  static async setCurrentProject(name : string) : Promise<ProjectSchema> {
    const db = await getDatabase()
    const data = (await Api.getProjectByName(name)).project
    db.setProject(data)
    return data
  }

  static async getStories(projectId : string) : Promise<StorySchema[]>  {
    const data = await Api.getStoriesByProjectId(projectId);
    return data.stories
  }

  static async getRecords() : Promise<RecordSchema[]> {
    const db = await getDatabase()
    return db.getStories()
  }
}

export { Store, RecordSchema, ProjectSchema, StorySchema }