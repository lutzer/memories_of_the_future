import { BaseModel } from './BaseModel'

class ProjectModel extends BaseModel {

  data : any = {
    ...this.data,
    name : 'unnamed',
    password : 'password',
    visible : true,
    createdAt : Date.now()
  }

  constructor(data : any) {
    super(data)
  }
} 

export { ProjectModel }