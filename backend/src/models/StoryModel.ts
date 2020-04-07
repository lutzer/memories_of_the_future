import { BaseModel } from './BaseModel'

class StoryModel extends BaseModel {

  data : any = {
    ...this.data,
    projectId : null,
    location : null,

    author : 'unknown',
    name : 'untitled',
    picture : null,
    recording : null,

    color : '#ffffff',
    visible: true,
    createdAt : Date.now()
  }

  constructor(data : any) {
    super(data)
    Object.assign(this.data, data)
  }

  validate() : boolean {
    if (this.data.projectId == null)
      return false
    return true
  }
} 

export { StoryModel }