import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

import { config } from './config'

type Schema = {
  projects: any[],
  stories : any[]
};

interface DatabaseAdapter extends low.LowdbSync<Schema> {}

const getDatabase = async () : Promise<DatabaseAdapter> => {
  const adapter = new FileSync<Schema>(config.databaseFile)
  const db = await low(adapter)
  
  // set defaults
  await db.defaults({ 
    projects: [], 
    stories: []
  }).write()
  
  return db
}


export { getDatabase, DatabaseAdapter }