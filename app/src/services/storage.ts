import { openDB, IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import { RecordSchema, ProjectSchema } from './store';

const DATABASE_NAME = 'motf-recorder'
const STORE_NAME_RECORDS = 'records'
const STORE_NAME_RECORDS_UPLOADED = 'records-uploaded'
const STORE_NAME_PROJECT = 'projects'
const STORE_NAME_FILES = 'files'
const PROJECT_ID = 1
const DB_VERSION = 18

interface Database {
  getRecords : () => Promise<RecordSchema[]>
  getRecord: (id: string) => Promise<RecordSchema>
  writeRecord : (story: RecordSchema) => Promise<RecordSchema>
  changeRecordId : (from : string, to: string) => Promise<RecordSchema>
  removeRecord : (id: string) => Promise<void>

  getProject : () => Promise<ProjectSchema>
  setProject : (project: ProjectSchema) => Promise<IDBValidKey>
}

function initDatabase(db : IDBPDatabase) {

  if (db.objectStoreNames.contains(STORE_NAME_RECORDS))
    db.deleteObjectStore(STORE_NAME_RECORDS)
  db.createObjectStore(STORE_NAME_RECORDS, {
    keyPath: 'id',
    autoIncrement: true,
  })

  if (db.objectStoreNames.contains(STORE_NAME_RECORDS_UPLOADED))
    db.deleteObjectStore(STORE_NAME_RECORDS_UPLOADED)
  db.createObjectStore(STORE_NAME_RECORDS_UPLOADED, {
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

    async function getRecords() : Promise<RecordSchema[]> {
      return await db.getAll(STORE_NAME_RECORDS)
    }

    // TODO: store image and recording in different data table
    async function writeRecord(record : RecordSchema) : Promise<RecordSchema> {
      record.id = record.id ? record.id : uuidv4()
      record.modifiedAt = Date.now()
      await db.put(STORE_NAME_RECORDS, record)
      return record
    }

    async function changeRecordId(from : string, to: string) {
      var record = await db.get(STORE_NAME_RECORDS, from)
      await db.delete(STORE_NAME_RECORDS, from)
      record.id = to
      await db.put(STORE_NAME_RECORDS, record)
      return record
    }

    async function removeRecord(id: string) : Promise<void> {
      return await db.delete(STORE_NAME_RECORDS, id)
    }

    async function getRecord(id: string) : Promise<RecordSchema> {
      return await db.get(STORE_NAME_RECORDS, id)
    }


    async function getProject() : Promise<ProjectSchema> {
      return await db.get(STORE_NAME_PROJECT, PROJECT_ID)
    }

    async function setProject(project: ProjectSchema) : Promise<IDBValidKey> {
      return await db.put(STORE_NAME_PROJECT, project, PROJECT_ID)
    }

    resolve({ 
      writeRecord, removeRecord, getRecords, getRecord, changeRecordId,
      getProject, setProject 
    })
  })
}

export { getDatabase }