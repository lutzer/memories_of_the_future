import { BaseModel } from './BaseModel'
import { generateRandomString } from './../utils'

type ProjectModelSchema = {
  id : string,
  name : string,
  description : string,
  password: string,
  visible : boolean,
  createdAt : number
}

class ProjectModel extends BaseModel {

  data : ProjectModelSchema = {
    ...this.data,
    name : 'unnamed',
    description : '',
    password : generateRandomString(),
    visible : true,
    createdAt : Date.now()
  }

  constructor(data : any) {
    super(data)
    Object.assign(this.data, data)
  }

  validate() : boolean {
    if (this.data.name == 'unnamed')
      return false
    return true
  }
} 

export { ProjectModel, ProjectModelSchema }