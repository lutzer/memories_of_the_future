import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { SpinnerComponent } from "./ProgressBarComponent";
import { getDatabase } from "../services/storage";

import './styles/upload.scss'
import { Api, ApiException } from "../services/api";
import { RecordSchema, StorySchema } from "../services/store";
import _ from "lodash";

enum UploadState {
  PASSWORD, LOADING, TRANSFERING, COMPLETE, CANCELED, ERROR
}

type Properties = {
  record : RecordSchema,
  onUploadSuccess : (record : RecordSchema, serverId : string) => void,
  onCancelled : () => void
}

const UploadComponent = ({ record, onUploadSuccess, onCancelled } : Properties) => {
  const { storyId } = useParams()
  const history = useHistory()

  const [state, setState] = useState(UploadState.PASSWORD)
  const [uploading, setUploading] = useState<boolean>(false)
  const [password, setPassword] = useState<string>(null)
  const [error, setError] = useState<string>(null)

  useEffect( () => {
    const controller = new AbortController()
    if (uploading)
    uploadRecord(storyId, controller)
    return function cleanup() {
      controller.abort()
    }
  }, [uploading])

  async function uploadRecord(id : string, controller: AbortController) {

    if (!record) {
      setState(UploadState.ERROR)
      setError('Can not retrieve memory.')
      return
    }

    if (record.uploaded) {
      setState(UploadState.ERROR)
      setError('Story has been uploaded already.')
      return
    }
      
    try {
      setState(UploadState.TRANSFERING)
      const newId = await Api.uploadStory(record, password, controller)
      setState(UploadState.COMPLETE)
      onUploadSuccess(record, newId)
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

  function onCancelButtonPress() {
    setUploading(false)
    onCancelled()
  }

  function onOk() {
    if (state == UploadState.COMPLETE)
      history.push(`../records/`)
    else {
      history.push(`../records/${storyId}`)
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
            <button onClick={onCancelButtonPress}>Cancel</button>
          :
            <button onClick={onCancelled}>OK</button>
          }
        </div>
      </div>
    )
}

export { UploadComponent }