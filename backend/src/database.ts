import low from 'lowdb'
import FileASync from 'lowdb/adapters/FileASync'

import { config } from './config'

type Schema = {
  projects: any[],
  stories : any[]
};

interface DatabaseAdapter extends low.LowdbAsync<Schema> {}

const getDatabase = async () : Promise<DatabaseAdapter> => {
  const adapter = new FileASync<Schema>(config.databaseFile)
  const db = await low(adapter)
  
  // set defaults
  await db.defaults({ 
    projects: [], 
    stories: []
  }).write()
  
  return db
}


export { getDatabase, DatabaseAdapter }