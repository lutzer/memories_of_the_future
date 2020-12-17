import { BaseModel } from './BaseModel'
import { generateRandomString } from './../utils'
import { ProjectModelSchema } from './Schemas'

class ProjectModel extends BaseModel {

  data : ProjectModelSchema = {
    ...this.data,
    name : 'unnamed',
    description : '',
    password : generateRandomString(),
    visible : true,
    location: [52.508239, 13.329132],
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