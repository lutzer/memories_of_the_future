import { openDB, IDBPDatabase } from 'idb';

const DATABASE_NAME = 'motf-recorder'
const STORE_NAME_STORIES = 'stories'
const STORE_NAME_PROJECTS = 'projects'
const DB_VERSION = 12

type StorySchema = {
  id: string,
  author: string,
  createdAt: number,
  recording?: Blob,
  image? : Blob,
  location? : [ number, number ],
}

type ProjectSchema = {
  id: string,
  name: string
}

interface Database {
  getStories : () => Promise<StorySchema[]>
  getStory : (id: string) => Promise<StorySchema>
  writeStory : (story: StorySchema) => Promise<IDBValidKey>
  removeStory : (id: string) => Promise<void>
}

function initDatabase(db : IDBPDatabase) {
  
  if (db.objectStoreNames.contains(STORE_NAME_STORIES))
    db.deleteObjectStore(STORE_NAME_STORIES)
  db.createObjectStore(STORE_NAME_STORIES, {
    keyPath: 'id',
    autoIncrement: true,
  })

  if (db.objectStoreNames.contains(STORE_NAME_PROJECTS))
    db.deleteObjectStore(STORE_NAME_PROJECTS)
  db.createObjectStore(STORE_NAME_PROJECTS)
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

    async function writeStory(story : StorySchema) : Promise<IDBValidKey> {
      return await db.put(STORE_NAME_STORIES, story)
    }

    async function removeStory(id: string) : Promise<void> {
      return await db.delete(STORE_NAME_STORIES, id)
    }

    async function getStory(id: string) : Promise<StorySchema> {
      return await db.get(STORE_NAME_STORIES, id)
    }

    
    resolve({ writeStory, removeStory, getStories, getStory })
  })
}

export { getDatabase, StorySchema }