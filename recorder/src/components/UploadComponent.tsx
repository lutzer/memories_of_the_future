import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { SpinnerComponent } from "./ProgressBarComponent";
import { getDatabase, StorySchema } from "../services/storage";

import './styles/upload.scss'
import { Api, ApiException } from "../services/api";
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

async function setStoryUploaded(story : StorySchema, oldStoryId : string) {
  const db = await getDatabase()
  const data : StorySchema = Object.assign({}, story, { uploaded: true})
  await db.writeStory(data)

  // remove old story
  await db.removeStory(oldStoryId)
}

enum UploadState {
  PASSWORD, LOADING, TRANSFERING, COMPLETE, ERROR
}

const UploadComponent = () => {
  const { storyId } = useParams()
  const history = useHistory()

  const [message, setMessage] = useState('Uploading Memory...')
  const [state, setState] = useState(UploadState.PASSWORD)
  const [uploading, setUploading] = useState(false)
  const [password, setPassword] = useState(null)

  useEffect( () => {
    const controller = new AbortController()
    if (uploading)
      uploadStory(storyId, controller)
    return function cleanup() {
      controller.abort()
    }
  }, [uploading])

  async function uploadStory(id : string, controller: AbortController) {
    const story = await readStory(id)

    if (!story) {
      setState(UploadState.ERROR)
      setMessage('Can not retrieve memory.')
      return
    }

    if (story.uploaded) {
      setState(UploadState.ERROR)
      setMessage('Story has been uploaded already.')
      return
    }
      
    try {
      setState(UploadState.TRANSFERING)
      await Api.uploadStory(story, password, controller)
      setStoryUploaded(story, id);
      setMessage('Memory has been uploaded.')
      setState(UploadState.COMPLETE)
    } catch (err) {
      setState(UploadState.ERROR)
      console.log(err)
      if (err.name === "AbortError") {
        setMessage('Upload cancelled.')
      } else if (err instanceof ApiException && err.statusCode == 401) {
        setMessage('Error: Authorization failed.')
      } else if (err instanceof ApiException) {
        setMessage('Error: ' + err.message)
      } else if (err instanceof Error) {
        setMessage('Server or connection error.')
        showModal('Error', err.message)
      }
    }
  }

  async function onCancel() {
    setUploading(false)
  }
  
  return(
    <div className='upload'>
      { state != UploadState.PASSWORD ?
        <div className='center-item'>
          <p>{message}</p>
          <SpinnerComponent 
            spinning={state == UploadState.TRANSFERING}
            completed={state == UploadState.COMPLETE}/>
          { state == UploadState.TRANSFERING ?
            <button onClick={onCancel}>Cancel</button>
          :
            <button onClick={() => history.push(`/story/${storyId}`)}>OK</button>
          }
        </div>
      :
        <div className='center-item'>
          <div className='input-element'>
          <input type='password' 
            placeholder='Enter password'
            onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <button onClick={() => setUploading(true)}>OK</button>
        </div>
      }
    </div>
  )
}

export { UploadComponent }