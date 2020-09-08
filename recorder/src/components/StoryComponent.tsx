import React, { useEffect, useState } from "react";
import './styles/project.scss'
import { ProjectSchema, StorySchema } from "../services/store";
import { Link, useParams } from "react-router-dom";
import _ from "lodash";

type Properties = {
  stories : StorySchema[]
}


const StoryComponent = ( {stories} : {stories : StorySchema[] } ) => {
  const { storyId } = useParams()
  
  const story = _.find(stories, { id: storyId })

  return (
    story ?
      <div>
        <h3>{story.title}</h3>
      </div>
    :
      <div>
        <p> Story does not exist</p>
      </div>
  )
}

export { StoryComponent }