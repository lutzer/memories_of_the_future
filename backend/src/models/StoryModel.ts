import { StoryModelSchema } from './Schemas'
import { BaseModel } from './BaseModel'
import _ from 'lodash'

import { config } from './../config' 


// hashes a string to a number from [0..range]
function hashString(str, range) {
  const charSum = str.split('').reduce( (acc, c) => {
    return acc + c.charCodeAt(0)
  },0)
  const crossSum = charSum.toString().split('').reduce( (acc, c) => {
    return acc + c.charCodeAt(0)
  })
  return crossSum % range
}

class StoryModel extends BaseModel {

  data : StoryModelSchema = {
    ...this.data,
    projectId : null,
    location : null, // [ long, lat ]

    author : 'unknown',
    title: 'unnamed',
    text : '',
    image : null,
    recording : null,

    color : '#ff0000',
    createdAt : Date.now(),
    attachments : []
  }

  constructor(data : any) {
    super(data)
    
    //pick color from author hash
    data.color = data.author ? config.markerColors[hashString(_.lowerCase(data.author), config.markerColors.length)] : config.markerColors[0]
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