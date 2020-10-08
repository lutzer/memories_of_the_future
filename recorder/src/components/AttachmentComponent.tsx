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

  function onTextChanged(text: string) {
    setText(text)
  }

  function onSaveClicked() {
    
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
          <TextInputComponent rows={5} maxLength={512} placeholder='Write comment' onChange={onTextChanged}/>
          <div className='button-group'>
            <button onClick={() => setCreateMode(false)}>Cancel</button>
            <button onClick={onSaveClicked} disabled={text.length <= 5}>Save</button>
          </div>
        </div>
        :
        <button onClick={() => setCreateMode(true)}>Add Attachment</button>
        
      }
    </div>
  )
}

export { AttachmentComponent }