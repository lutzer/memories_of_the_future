import { v1 as uuidv1 } from 'uuid';

class BaseModel {

  data : any = {
    id : uuidv1()
  }
    
  constructor(data = {}) {
    Object.assign(this.data, data)
  }

  validate() {
    return true
  }
}


export { BaseModel }
