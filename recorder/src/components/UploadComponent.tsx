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
  LOADING, TRANSFERING, COMPLETE, ERROR
}

const UploadComponent = () => {
  const { storyId } = useParams()
  const history = useHistory()

  const [message, setMessage] = useState('Uploading Memory...')
  const [state, setState] = useState(UploadState.LOADING)
  const [uploading, setUploading] = useState(true)

  useEffect( () => {
    const controller = new AbortController()
    if (uploading)
      uploadStory(storyId, controller)
    return function cleanup() {
      controller.abort()
    }
  }, [uploading])

  async function uploadStory(storyId : string, controller: AbortController) {
    const storyData = await readStory(storyId)

    if (!storyData) {
      setState(UploadState.ERROR)
      setMessage('Can not retrieve memory.')
      return
    }
      
    try {
      setState(UploadState.TRANSFERING)
      await Api.uploadStory(storyData, controller)
      setMessage('Memory has been uploaded.')
      setState(UploadState.COMPLETE)
    } catch (err) {
      setState(UploadState.ERROR)
      console.log(err)
      if (err.name === "AbortError") {
        setMessage('Upload cancelled.')
      } else if (err instanceof Error) {
        setMessage(err.message)
      }
    }
  }

  async function onCancel() {
    setUploading(false)
  }

  console.log(state)
  
  return(
    <div className='upload'>
      <div className='center-item'>
        <p>{message}</p>
        <SpinnerComponent 
          spinning={state == UploadState.TRANSFERING}
          completed={state == UploadState.COMPLETE}/>
        { state == UploadState.TRANSFERING ?
          <button onClick={onCancel}>Cancel</button>
        :
          <button onClick={() => history.push(`/stories/`)}>OK</button>
        }
      </div>
    </div>
    
  )
}

export { UploadComponent }