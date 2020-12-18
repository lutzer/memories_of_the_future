import { v1 as uuidv1 } from 'uuid';
import { BaseSchema } from './Schemas';


class BaseModel {

  data : BaseSchema = {
    id : uuidv1()
  }
    
  constructor(data = {}) {
    Object.assign(this.data, data)
  }

  validate() : boolean {
    return true
  }
}


export { BaseModel, BaseSchema }
