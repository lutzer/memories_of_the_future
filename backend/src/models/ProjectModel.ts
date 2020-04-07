import { BaseModel } from './BaseModel'

class ProjectModel extends BaseModel {

  data : any = {
    ...this.data,
    name : 'unnamed',
    description : '',
    password : 'password',
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

export { ProjectModel }