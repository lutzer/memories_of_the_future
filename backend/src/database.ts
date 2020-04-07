import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

import { config } from './config'

type Schema = {
  projects: any[],
  stories : any[]
};

interface DatabaseAdapter extends low.LowdbSync<Schema> {}

const getDatabase = () : DatabaseAdapter => {
  const adapter = new FileSync<Schema>(config.databaseFile)
  const db = low(adapter)
  
  // set defaults
  db.defaults({ 
    projects: [], 
    stories: []
  }).write()
  
  return db
}


export { getDatabase, DatabaseAdapter }