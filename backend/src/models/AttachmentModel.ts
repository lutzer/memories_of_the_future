import { BaseModel } from './BaseModel'

enum AttachmentType {
  TEXT = 'text',
  IMAGE = 'image'
}

type AttachmentModelSchema = {
  id : string,
  storyId : string,
  text : string,
  author: string,
  type : AttachmentType,
  createdAt : number
}

class AttachmentModel extends BaseModel {

  data : AttachmentModelSchema = {
    ...this.data,
    storyId : null,
    text : '',
    author: 'unknown',
    createdAt : Date.now()
  }

  constructor(data : any) {
    super(data)
    Object.assign(this.data, data)
  }

  validate() : boolean {
    if (this.data.storyId == null)
      return false
    if (!Object.values(AttachmentType).includes(this.data.type))
      return false
    return true
  }
} 

export { AttachmentModel, AttachmentModelSchema }