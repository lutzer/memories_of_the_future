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
    data.createdAt = Date.now()
    const db = await getDatabase()
    db.get(this.path).push(data).write()
    return data;
  }
}

const storyModel : DataEditor.DataModel = new DataEditor.DataModel({
  schema: {
    $id: 'stories',
    properties: {
      id : { type: 'string', autoIncrement: true  },
      projectId : { type: 'string'},
      location : { type: 'array', minItems: 2 },
      author : { type: 'string', maxLength: 32 },
      title : { type: 'string', minLength: 3 },
      text : { type: 'string', maxLength: 1024 },
      image : { type: ['string','null'] },
      recording : { type: ['string','null'] },

      color : { type: 'string' },
      createdAt : { type: 'number', autoIncrement: true }
    },
    primaryKey : 'id',
    required: ['projectId', 'title'],
    titleTemplate: '<%= author %>:<%= title %>',
    links: [ 
      { model: 'projects', key: 'projectId', foreignKey: 'id'},
      { model: 'attachments', key: 'id', foreignKey: 'storyId'},
    ]
  },
  adapter: new LowDbAdapter('stories')
})

const projectModel : DataEditor.DataModel = new DataEditor.DataModel({
  schema : {
    $id: 'projects',
    properties: {
      id : { type: 'string', autoIncrement: true },
      name : { type: 'string', minLength: 3 },
      description : { type: 'string', minLength: 3, maxLength: 1024 },
      password: { type: 'string', minLength: 3 },
      visible : { type: 'boolean' },
      location : { type: 'array', minItems: 2, maxItems: 2 },
      createdAt : { type: 'number', autoIncrement: true }
    },
    primaryKey: 'id',
    required : ['name', 'description', 'password'],
    titleTemplate: '<%= name %>',
    links: [ { model: 'stories', key: 'id', foreignKey: 'projectId'}]
  },
  adapter: new LowDbAdapter('projects')
})

const attachmentModel : DataEditor.DataModel = new DataEditor.DataModel({
  schema : {
    $id: 'attachments',
    properties: {
      id : { type: 'string', autoIncrement: true  },
      storyId : { type: 'string' },
      text : { type: 'string', maxLength: 1024 },
      author: { type: 'string', minLength: 3, maxLength: 32 },
      image : { type: 'string' },
      createdAt : { type: 'number', autoIncrement: true }
    },
    primaryKey: 'id',
    required : ['storyId', 'author'],
    titleTemplate: '<%= author %>:<%= id %>'
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