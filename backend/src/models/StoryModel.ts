import { BaseModel } from './BaseModel'

type StoryModelSchema = {
  id : string,
  projectId : string,
  location : [ number, number ]
  
  author : string,
  title : string,
  image : string,
  recording : string,

  color : string,
  visible: boolean,
  createdAt : number
}

class StoryModel extends BaseModel {

  data : StoryModelSchema = {
    ...this.data,
    projectId : null,
    location : null, // [ long, lat ]

    author : 'unknown',
    title : 'untitled',
    image : null,
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

export { StoryModel, StoryModelSchema }