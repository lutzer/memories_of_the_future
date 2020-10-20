import { BaseModel } from './BaseModel'

type AttachmentModelSchema = {
  id : string,
  storyId : string,
  text : string,
  author: string,
  image : string,
  createdAt : number
}

class AttachmentModel extends BaseModel {

  data : AttachmentModelSchema = {
    ...this.data,
    storyId : null,
    text : '',
    author: 'unknown',
    image: null,
    createdAt : Date.now()
  }

  constructor(data : any) {
    super(data)
    Object.assign(this.data, data)
  }

  validate() : boolean {
    if (this.data.storyId == null)
      return false
    return true
  }
} 

export { AttachmentModel, AttachmentModelSchema }