import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

import { config } from './config'

const getDatabase = () => {
  const adapter = new FileSync(config.databaseFile)
  const db = low(adapter)
  
  // set defaults
  db.defaults({ 
    projects: ['project1', 'project2'], 
    stories: ['story1', 'story2']
  }).write()
  
  return db
}

interface DatabaseAdapter extends low.LowdbSync<any> {}

export { getDatabase, DatabaseAdapter }