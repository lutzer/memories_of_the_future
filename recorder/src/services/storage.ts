import { openDB, deleteDB, IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import { AudioRecording } from '../media/recorder';

const DATABASE_NAME = 'motf-recorder'
const STORE_NAME_STORIES = 'stories'
const STORE_NAME_PROJECT = 'projects'
const STORE_NAME_FILES = 'files'
const PROJECT_ID = 1
const DB_VERSION = 18

type StorySchema = {
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
  name: string,
  description: string
  password?: string,
}

interface Database {
  getStories : () => Promise<StorySchema[]>
  getStory : (id: string) => Promise<StorySchema>
  writeStory : (story: StorySchema) => Promise<StorySchema>
  removeStory : (id: string) => Promise<void>

  getProject : () => Promise<ProjectSchema>
  setProject : (project: ProjectSchema) => Promise<IDBValidKey>
}

function initDatabase(db : IDBPDatabase) {

  if (db.objectStoreNames.contains(STORE_NAME_STORIES))
    db.deleteObjectStore(STORE_NAME_STORIES)
  db.createObjectStore(STORE_NAME_STORIES, {
    keyPath: 'id',
    autoIncrement: true,
  })

  if (db.objectStoreNames.contains(STORE_NAME_PROJECT))
    db.deleteObjectStore(STORE_NAME_PROJECT)
  db.createObjectStore(STORE_NAME_PROJECT)

  if (db.objectStoreNames.contains(STORE_NAME_FILES))
    db.deleteObjectStore(STORE_NAME_FILES)
  db.createObjectStore(STORE_NAME_FILES)
}

const getDatabase = async () : Promise<Database> => {
  return new Promise(async (resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject('This browser doesn\'t support IndexedDB');
      return
    }
    const db = await openDB(DATABASE_NAME, DB_VERSION, {
      upgrade: (db, oldVersion, newVersion, transaction) => {
        initDatabase(db)
      }
    })

    async function getStories() : Promise<StorySchema[]> {
      return await db.getAll(STORE_NAME_STORIES)
    }

    // TODO: store image and recording in different data table
    async function writeStory(story : StorySchema) : Promise<StorySchema> {
      story.id = story.id ? story.id : uuidv4()
      story.modifiedAt = Date.now()
      await db.put(STORE_NAME_STORIES, story)
      return story
    }

    async function removeStory(id: string) : Promise<void> {
      return await db.delete(STORE_NAME_STORIES, id)
    }

    async function getStory(id: string) : Promise<StorySchema> {
      return await db.get(STORE_NAME_STORIES, id)
    }


    async function getProject() : Promise<ProjectSchema> {
      return await db.get(STORE_NAME_PROJECT, PROJECT_ID)
    }

    async function setProject(project: ProjectSchema) : Promise<IDBValidKey> {
      return await db.put(STORE_NAME_PROJECT, project, PROJECT_ID)
    }

    resolve({ 
      writeStory, removeStory, getStories, getStory, 
      getProject, setProject 
    })
  })
}

export { getDatabase, StorySchema, ProjectSchema }