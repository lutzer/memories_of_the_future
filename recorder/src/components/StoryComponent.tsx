import React, { useEffect, useState } from "react";
import './styles/project.scss'
import { ProjectSchema, StorySchema } from "../services/store";
import { Link, useParams } from "react-router-dom";
import _ from "lodash";

import './styles/story.scss'

type Properties = {
  stories : StorySchema[]
}


const StoryComponent = ( {stories} : {stories : StorySchema[] } ) => {
  const { storyId } = useParams()
  
  const story = _.find(stories, { id: storyId })

  console.log(story)

  return (
    story ?
      <div className='story'>
        <h2>{story.title}</h2>
        <div className='item'>
          <div className='image'>
            <img src={story.image}/>
          </div>
        </div>
      </div>
    :
      <div>
        <p> Story does not exist</p>
      </div>
  )
}

export { StoryComponent }