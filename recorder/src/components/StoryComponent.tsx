import React, { useEffect, useState } from "react";
import './styles/project.scss'
import { ProjectSchema, StorySchema } from "../services/store";
import { Link, useParams } from "react-router-dom";
import _ from "lodash";

import './styles/story.scss'
import { AudioPlayerComponent } from "./AudioRecorderComponent";
import { AudioRecording } from "../media/recorder";

type Properties = {
  story : StorySchema
}


const StoryComponent = ( {story} : Properties ) => {
  const [ recording, setRecording ] = useState<AudioRecording>(null)

  return (
    story ?
      <div className='story'>
        <h2>{story.title}</h2>
        <div className='item text'>
          <p>{story.text}</p>
        </div>
        <div className='item'>
          <div className='image'>
            <img src={story.image}/>
          </div>
        </div>
        <div className='item'>
          <AudioPlayerComponent audioUrl={story.recording}/>
        </div>
        <div className='item'>
          <p>Location: {story.location[0]}, {story.location[1]}</p>
        </div>
      </div>
    :
      <div>
        <p> Story does not exist</p>
      </div>
  )
}

export { StoryComponent }