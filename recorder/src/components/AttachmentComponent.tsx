import _ from "lodash";
import React, { useEffect, useState } from "react";
import { AttachmentSchema } from "../services/store";
import { TextInputComponent } from "./TextInputComponent";
import { DialogBoxComponent } from "./DialogBoxComponent";
import { Api } from "../services/api";
import { dateFromNow } from "../utils/utils";

import './styles/attachment.scss'
import './styles/upload.scss'
import { SpinnerComponent } from "./ProgressBarComponent";

type Properties = {
  attachments : AttachmentSchema[]
  storyId : string
  projectName: string
}

const AttachmentComponent = ({ storyId, attachments, projectName } : Properties) => {
  
  enum State {
    INIT, WRITE
  }

  const [ state, setState] = useState<State>(State.INIT)

  function renderAttachments() {
    return(
      <ul className='attachment-list'>
        { !_.isEmpty(attachments) ?
          attachments.map( (attachment, i) => {
            return(
              <li key={i}>
                { attachment.text && <p className='text'>{attachment.text}</p> }
                { attachment.image && 
                <div className='image'>
                  <img src={attachment.image}/>
                </div>
                }
                <p className='author'>{attachment.author}</p>
              </li>
            )
          })
          :
          <p className='no-attachments'>Nothing attached to this memory</p>
        }
      </ul>
    )
  }

  if ( state == State.WRITE)
      return(
        <div className='attachment-component'>
        { renderAttachments() }
        <AttachmentInputComponent 
          storyId={storyId} 
          projectName={projectName} 
          onCancel={() => setState(State.INIT)}
          onComplete={() => setState(State.INIT)}/>
        </div>
      )
  else
    return(
      <div className='attachment-component'>
        { renderAttachments() }
        <button onClick={() => setState(State.WRITE)}>Add Attachment</button>
      </div>
    )
}

const AttachmentInputComponent = ({ storyId, projectName, onCancel, onComplete } : {
  storyId : string,
  projectName : string,
  onCancel : () => void,
  onComplete : () => void
}) => {

  enum State {
    INIT, PASSWORD, UPLOADING
  }

  const [ state, setState ] = useState(State.INIT)

  const [ text, setText ] = useState<string>('')
  const [ author, setAuthor ] = useState<string>('')
  const [ image, setImage ] = useState<Blob>(null)
  const [ password, setPassword ] = useState<string>('')

  useEffect(() => {
    if (state == State.UPLOADING) {
      Api.addAttachment({ text: text, author: author, storyId: storyId}, image, password, projectName).then(() => {
        onComplete()
        clearState()
      }).catch( (err) => {
        if (err instanceof Error) showModal('Error', err.message)
        setState(State.INIT)
      })
    }
  },[state])

  function clearState() {
    setState(State.INIT)
    setAuthor('')
    setImage(null)
    setText('')
    setPassword('')
  }

  function isDisabled() {
    return !((text.length > 5 || image) && author.length > 2)
  }

  function onFileInputChange(e : React.ChangeEvent<HTMLInputElement>) {
    const file : Blob = e.target.files[0]
    setImage(file)
  }

  function renderInputFields() {
    return(
      <div>
        <div className='item'></div>
        <TextInputComponent text={text} rows={5} maxLength={512} placeholder='Write comment' onChange={setText}/>
        <div className='spacer'/>
        <TextInputComponent text={author} rows={1} maxLength={64} placeholder='Your Name' onChange={setAuthor}/>
        { image ?
        <div className='image-added'>
          <button className='remove-button' onClick={() => setImage(null)}>Remove Image</button>
        </div>
        :
        <div className='input'>
          <label htmlFor='cameraInput' className='button'>Add Image</label>
          <input id='cameraInput' style={{display : 'none'}} onChange={onFileInputChange} type="file" name="image" accept="image/*"/>
        </div>
        }
        <div className='button-group'>
          <button onClick={() => onCancel()}>Cancel</button>
          <button onClick={() => setState(State.PASSWORD)} disabled={isDisabled()}>Save</button>
        </div>
      </div>
    )
  }

  if (state == State.PASSWORD)
    return(
      <div>
        { renderInputFields() }
        <DialogBoxComponent>
          <div className='upload'>
            <div className='center-item'>
                <div className='input-element'>
                  <input type='password' 
                  placeholder='Enter password'
                  onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button onClick={() => setState(State.UPLOADING)}>OK</button>
            </div>
          </div>
        </DialogBoxComponent>
      </div>
    )
  else if (state == State.UPLOADING)
    return(
      <div>
        { renderInputFields() }
        <DialogBoxComponent>
          <div className='upload'>
            <div className='center-item'>
            <p>Uploading Attachment</p>
            <SpinnerComponent spinning={true}/> 
            </div>
          </div>
        </DialogBoxComponent>
      </div>
    )
  else 
    return(
      <div>
        { renderInputFields() }
      </div>
    )
  
}

export { AttachmentComponent }