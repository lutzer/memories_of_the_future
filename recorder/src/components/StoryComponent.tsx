import React, { useEffect, useState } from "react";
import './styles/project.scss'
import { ProjectSchema, StorySchema } from "../services/store";
import { Link, useParams } from "react-router-dom";
import _ from "lodash";

import './styles/story.scss'
import { AudioPlayerComponent } from "./AudioRecorderComponent";
import { AudioRecording } from "../media/recorder";
import { dateFromNow } from "../utils/utils";
import { AttachmentComponent } from "./AttachmentComponent";

const StoryColorIcon = ( { color } : { color : string}) => {
  const primaryColor = color
  const secondaryColor = color + '55'

  return(
    <div className='story-color-icon' style={{ background : secondaryColor}}>
      <div style={{ background : primaryColor}}></div>
    </div>
  )
}

type Properties = {
  story : StorySchema
  projectName: string
  setSelected : (id : string) => void
}


const StoryComponent = ( {story, projectName, setSelected} : Properties ) => {

  useEffect(() => { 
    if (story)
      setSelected(story.id) 
    return () => setSelected(null)
  },[story])

  return (
    story ?
      <div className='story'>
        <h2 className='slideheader'>{story.title}</h2>
        <div className='item date'>
          <p className='createdAt'>Created {dateFromNow(story.createdAt)} by {story.author}.</p>
        </div>
        <div className='item general'>
          <p className='project-name'>{projectName}</p>
          <StoryColorIcon color={story.color}/>
        </div>
        { story.image && 
        <div className='item'>
          <div className='image'>
            <img src={story.image}/>
          </div>
        </div>
        }
        { story.recording &&
        <div className='item player'>
          <AudioPlayerComponent audioUrl={story.recording}/>
        </div>
        }
        { story.text && <div className='item text'>
          <p className='no-italic'>{story.text}</p>
        </div> }
        <div className='item attachments'>
          <h2>Attachments</h2>
          <AttachmentComponent attachments={story.attachments} storyId={story.id} projectName={projectName}/>
        </div>
      </div>
    :
      <div style={{textAlign : 'center'}}>
        <p> Story does not exist</p>
      </div>
  )
}

export { StoryComponent }