import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { SpinnerComponent } from "./ProgressBarComponent";
import { getDatabase, StorySchema } from "../services/storage";

import './styles/upload.scss'
import { Api, ApiException } from "../services/api";

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
  PASSWORD, LOADING, TRANSFERING, COMPLETE, CANCELED, ERROR
}

const UploadComponent = () => {
  const { storyId } = useParams()
  const history = useHistory()

  const [state, setState] = useState(UploadState.PASSWORD)
  const [uploading, setUploading] = useState<boolean>(false)
  const [password, setPassword] = useState<string>(null)
  const [error, setError] = useState<string>(null)

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
      setError('Can not retrieve memory.')
      return
    }

    if (story.uploaded) {
      setState(UploadState.ERROR)
      setError('Story has been uploaded already.')
      return
    }
      
    try {
      setState(UploadState.TRANSFERING)
      await Api.uploadStory(story, password, controller)
      setStoryUploaded(story, id);
      setState(UploadState.COMPLETE)
    } catch (err) {
      console.log(err)
      if (err.name === "AbortError") {
        setState(UploadState.CANCELED)
      } else if (err instanceof ApiException && err.statusCode == 401) {
        setState(UploadState.ERROR)
        setError('Authorization failed.')
      } else if (err instanceof ApiException) {
        setState(UploadState.ERROR)
        setError(err.message)
      } else if (err instanceof Error) {
        setState(UploadState.ERROR)
        setError('Server or connection error.')
      }
    }
  }

  function onCancel() {
    setUploading(false)
  }

  function onOk() {
    if (state == UploadState.COMPLETE)
      history.push(`/stories/`)
    else {
      history.push('/story/' + storyId)
    }
  }

  function getMessage() : string {
    switch (state) {
      case UploadState.LOADING:
        return 'Fetching data...'
      case UploadState.TRANSFERING:
        return 'Uploading memory...'
      case UploadState.COMPLETE:
        return 'Memory has been uploaded.'
      case UploadState.CANCELED:
        return 'Memory upload has been canceled.'

    }
  }
  
  if (state == UploadState.PASSWORD)
    return(
      <div className='upload'>
        <div className='center-item'>
          <div className='input-element'>
          <input type='password' 
            placeholder='Enter password'
            onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <button onClick={() => setUploading(true)}>OK</button>
        </div>
      </div>
    )
  else
    return(
      <div className='upload'>
        <div className='center-item'>
          <div className='error'>
            { error }
          </div>
          <p>{getMessage()}</p>
          { !error && 
          <SpinnerComponent 
            spinning={state == UploadState.TRANSFERING}
            completed={state == UploadState.COMPLETE}/> 
          }
          { state == UploadState.TRANSFERING ?
            <button onClick={onCancel}>Cancel</button>
          :
            <button onClick={onOk}>OK</button>
          }
        </div>
      </div>
    )
}

export { UploadComponent }