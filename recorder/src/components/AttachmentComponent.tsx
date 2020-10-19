import _ from "lodash";
import React, { useEffect, useState } from "react";
import { AttachmentSchema } from "../services/store";
import { TextInputComponent } from "./TextInputComponent";
import { DialogBoxComponent } from "./DialogBoxComponent";
import { Api } from "../services/api";
import { dateFromNow } from "../utils/utils";

import './styles/attachment.scss'

type Properties = {
  attachments : AttachmentSchema[]
  storyId : string
  projectName: string
}

enum State {
  INIT, WRITE, PASSWORD, SUBMIT
}

const AttachmentComponent = ({ storyId, attachments, projectName } : Properties) => {
  const [ text, setText ] = useState('')
  const [ author, setAuthor ] = useState('')
  const [ password, setPassword] = useState('')
  const [ state, setState] = useState<State>(State.INIT)

  useEffect(() => {
    if (state == State.SUBMIT) {
      Api.addAttachment({ text: text, author: author, type: 'text', storyId: storyId}, password, projectName).then(() => {
        setState(State.INIT)
        setText('')
        setAuthor('')
      }).catch( (err) => {
        if (err instanceof Error) showModal('Error', err.message)
        setState(State.WRITE)
      })
    }
  },[state])

  function isDisabled() {
    return text.length < 6 || author.length < 3
  }

  function renderAttachments() {
    return(
      <ul className='attachment-list'>
        { !_.isEmpty(attachments) ?
          attachments.map( (attachment, i) => {
            return(
              <li key={i}>
                <p className='text'>{attachment.text}</p>
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
        <div>
          <div className='item'></div>
          <TextInputComponent text={text} rows={5} maxLength={512} placeholder='Write comment' onChange={setText}/>
          <div className='spacer'/>
          <TextInputComponent text={author} rows={1} maxLength={64} placeholder='Your Name' onChange={setAuthor}/>
          <div className='button-group'>
            <button onClick={() => setState(State.INIT)}>Cancel</button>
            <button onClick={() => setState(State.PASSWORD)} disabled={isDisabled()}>Save</button>
          </div>
        </div>
        </div>
      )
  else if ( state == State.PASSWORD)
    return(
      <div className='attachment-component'>
        { renderAttachments() }
        <div>
          <div className='item'></div>
          <p>{text}</p>
          <div className='spacer'/>
          <p>{author}</p>
        </div>
        <DialogBoxComponent>
          <div className='center-item'>
            <div className='input-element'>
              <input type='password'
                placeholder='Enter password'
                onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button onClick={() => setState(State.SUBMIT)}>OK</button>
          </div>
        </DialogBoxComponent>
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

export { AttachmentComponent }