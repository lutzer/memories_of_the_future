import { openDB, deleteDB, wrap, unwrap, IDBPDatabase } from 'idb';

const DATABASE_NAME = "motf-recorder"
const STORE_NAME_STORIES = "stories"
const DB_VERSION = 12

type StorySchema = {
  id: number,
  author: string,
  recording?: Blob
}

interface Database {
  getAll : () => Promise<StorySchema[]>
  write : (story: StorySchema) => Promise<IDBValidKey>
  remove : (id: number) => Promise<void>
}

function initDatabase(db : IDBPDatabase) {
  if (db.objectStoreNames.contains(STORE_NAME_STORIES))
    db.deleteObjectStore(STORE_NAME_STORIES)
  db.createObjectStore(STORE_NAME_STORIES, {
    keyPath: 'id',
    autoIncrement: true,
  })
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

    async function getAll() : Promise<StorySchema[]> {
      return await db.getAll(STORE_NAME_STORIES)
    }

    async function write(story : StorySchema) : Promise<IDBValidKey> {
      return await db.put(STORE_NAME_STORIES, story)
    }

    async function remove(id: number) : Promise<void> {
      return await db.delete(STORE_NAME_STORIES, id)
    }


    // db.put(STORE_NAME_STORIES,{ val: 'test2' })

    
    resolve({ getAll, write, remove })
  })
}

export { getDatabase, StorySchema }