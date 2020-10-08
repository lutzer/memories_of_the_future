import _, { create } from "lodash";
import React, { useEffect, useState } from "react";
import { AttachmentSchema } from "../services/store";
import { TextInputComponent } from "./TextInputComponent";

import './styles/attachment.scss'

type Properties = {
  attachments : AttachmentSchema[]
  storyId : string
}

const AttachmentComponent = ({ storyId, attachments } : Properties) => {
  const [ createMode, setCreateMode ] = useState(false)
  const [ text, setText ] = useState('')
  const [ author, setAuthor ] = useState('')

  function onSaveClicked() {

  }

  function isDisabled() {
    return text.length < 6 || author.length < 3
  }

  return(
    <div className='attachment-component'>
      { !_.isEmpty(attachments) ?
        attachments.map( (attachment, i) => {
          return(
            <p key={i}>{attachment.text}</p>
          )
        })
        :
        <p className='no-attachments'>Nothing attached to this memory</p>
      }
      { createMode ?
        <div>
          <div className='item'></div>
          <TextInputComponent rows={5} maxLength={512} placeholder='Write comment' onChange={setText}/>
          <div className='spacer'/>
          <TextInputComponent rows={1} maxLength={64} placeholder='Your Name' onChange={setAuthor}/>
          <div className='button-group'>
            <button onClick={() => setCreateMode(false)}>Cancel</button>
            <button onClick={onSaveClicked} disabled={isDisabled()}>Save</button>
          </div>
        </div>
        :
        <button onClick={() => setCreateMode(true)}>Add Attachment</button>
        
      }
    </div>
  )
}

export { AttachmentComponent }