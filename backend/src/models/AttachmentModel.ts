import { BaseModel, BaseSchema } from './BaseModel'

type AttachmentModelSchema = {
  storyId : string,
  text : string,
  author: string,
  image : string,
  createdAt : number
} & BaseSchema

class AttachmentModel extends BaseModel {

  data : AttachmentModelSchema = {
    ...this.data,
    storyId : null,
    text : null,
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