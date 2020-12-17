import { BaseModel } from './BaseModel'
import { AttachmentModelSchema } from './Schemas'

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