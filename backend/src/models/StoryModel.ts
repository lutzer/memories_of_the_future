import { BaseModel } from './BaseModel'

type Tupel = [number, number]

class StoryModel extends BaseModel {

  data : any = {
    ...this.data,
    projectId : null,
    location : null, // [ long, lat ]

    author : 'unknown',
    title : 'untitled',
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
    if (this.data.location == null)
      return false
    return true
  }
} 

export { StoryModel }