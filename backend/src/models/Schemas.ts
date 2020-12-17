type BaseSchema = {
  id: string
}

type ProjectModelSchema = {
  name : string,
  description : string,
  password: string,
  visible : boolean,
  location : [number, number],
  createdAt : number
} & BaseSchema

type AttachmentModelSchema = {
  storyId : string,
  text : string,
  author: string,
  image : string,
  createdAt : number
} & BaseSchema

type StoryModelSchema = {
  projectId : string,
  location : [ number, number ]
  
  author : string,
  title : string,
  text : string,
  image : string,
  recording : string,

  color : string,
  createdAt : number,
  attachments: AttachmentModelSchema[]
} & BaseSchema

export type { BaseSchema, ProjectModelSchema, AttachmentModelSchema, StoryModelSchema }

