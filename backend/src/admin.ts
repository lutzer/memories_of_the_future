import _ from 'lodash'
import * as DataEditor from 'node-data-editor'
import { config } from './config'
import { getDatabase } from './database'
import { v1 as uuidv1 } from 'uuid';

type DbPath = 'stories'|'projects'|'attachments'

class LowDbAdapter implements DataEditor.Adapter {

  path: DbPath

  constructor(path: DbPath) {
    this.path = path
  }

  async list(): Promise<object[]> {
    const db = await getDatabase()
    return db.get(this.path).value()
  }
  async read(id: string): Promise<object> {
    const db = await getDatabase()
    return (<any> db.get(this.path)).find({ id: id }).value()
  }
  async update(id: string, data: any): Promise<void> {
    const db = await getDatabase()
    const entry = (<any> db.get(this.path)).find({ id: id })
    entry.assign(data).write()
  }
  async delete(id: string): Promise<void> {
    const db = await getDatabase()
    db.get(this.path).remove({ id: id}).write()
  }
  async create(data: any): Promise<object> {
    data.id = uuidv1()
    const db = await getDatabase()
    db.get(this.path).push(data).write()
    return data;
  }
}

const storyModel : DataEditor.DataModel = new DataEditor.DataModel({
  schema: {
    $id: 'stories',
    properties: {
      id : { type: 'string' },
      projectId : { type: 'string'},
      location : { type: 'array', minItems: 2 },
      author : { type: 'string' },
      title : { type: 'string', minLength: 3 },
      text : { type: 'string' },
      image : { type: ['string','null'] },
      recording : { type: ['string','null'] },

      color : { type: 'string' },
      createdAt : { type: 'number' }
    },
    primaryKey : 'id',
    required: ['projectId', 'title']
  },
  adapter: new LowDbAdapter('stories')
})

const projectModel : DataEditor.DataModel = new DataEditor.DataModel({
  schema : {
    $id: 'projects',
    properties: {
      id : { type: 'string' },
      name : { type: 'string', minLength: 3 },
      description : { type: 'string', minLength: 3 },
      password: { type: 'string', minLength: 3 },
      visible : { type: 'boolean' },
      color : { type: 'string' },
      createdAt : { type: 'number' }
    },
    primaryKey: 'id',
    required : ['name', 'description', 'password']
  },
  adapter: new LowDbAdapter('projects')
})

const attachmentModel : DataEditor.DataModel = new DataEditor.DataModel({
  schema : {
    $id: 'attachments',
    properties: {
      id : { type: 'string' },
      storyId : { type: 'string' },
      text : { type: 'string' },
      author: { type: 'string', minLength: 3 },
      image : { type: 'string' },
      createdAt : { type: 'number' }
    },
    primaryKey: 'id',
    required : ['storyId', 'author']
  },
  adapter: new LowDbAdapter('attachments')
})

const startAdminInterface = (port : number) : Promise<any> => {
  return DataEditor.start({
    models: [storyModel, projectModel, attachmentModel],
    port: port,
    credentials : {
      login: config.adminLogin,
      password: config.adminPassword
    }
  })
}

export { startAdminInterface }