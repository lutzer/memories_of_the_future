import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { SpinnerComponent } from "./ProgressBarComponent";
import { getDatabase, StorySchema } from "../services/storage";

import './styles/upload.scss'
import { Api } from "../services/api";
import { LoaderOptionsPlugin } from "webpack";

function handleDbError(err : any) {
  console.log(err)
  if (err instanceof Error) showModal('Error', err.message)
}

async function readStory(storyId : string) {
  try {
    const db = await getDatabase()
    const data = await db.getStory(storyId)
    return data
  } catch (err) {
    return null;
  }
}

async function setStoryUploaded(story : StorySchema) {
  const db = await getDatabase()
  const data : StorySchema = Object.assign({}, story, { uploaded: true})
  db.writeStory(data)
}

enum UploadState {
  LOADING, TRANSFERING, COMPLETE
}

const UploadComponent = () => {
  const { storyId } = useParams()
  const history = useHistory()

  const [message, setMessage] = useState('Uploading Memory...')
  const [state, setState] = useState(UploadState.LOADING)

  useEffect( () => {
    uploadStory()
  }, [storyId])

  async function uploadStory() {
    const storyData = await readStory(storyId)

    if (!storyData) {
      setMessage('Can not retrieve memory.')
      return
    }
      
    try {
      setState(UploadState.TRANSFERING)
      await Api.uploadStory(storyData)
      setMessage('Memory has been uploaded.')
    } catch (err) {
      console.log(err)
      setMessage('Could not upload memory')
    }
    setState(UploadState.COMPLETE)
  }
  
  return(
    <div className='upload'>
      <div className='center-item'>
        <p>{message}</p>
        <SpinnerComponent 
          start={state == UploadState.TRANSFERING} 
          completed={state == UploadState.COMPLETE}/>
        <button onClick={() => history.push(`/story/${storyId}`)}>Cancel</button>
      </div>
    </div>
    
  )
}

export { UploadComponent }