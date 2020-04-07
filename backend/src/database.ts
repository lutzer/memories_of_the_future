import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

import { config } from './config'

const getDatabase = () : DatabaseAdapter => {
  const adapter = new FileSync(config.databaseFile)
  const db = low(adapter)
  
  // set defaults
  db.defaults({ 
    projects: [], 
    stories: []
  }).write()
  
  return db
}

interface DatabaseAdapter extends low.LowdbSync<any> {}

export { getDatabase, DatabaseAdapter }