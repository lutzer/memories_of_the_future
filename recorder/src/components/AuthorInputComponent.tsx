import React, { useState, useEffect } from "react";
import { DialogBoxComponent } from "./DialogBoxComponent";
import { useHistory } from "react-router-dom";

import './styles/input.scss'

const AuthorInputComponent = ({onCancel, onSave, enabled} : 
  { onCancel: () => void, onSave : (name: string) => void, enabled : boolean}) => {
  const [name, setName] = useState('')

  function onCancelButtonPressed() {
    onCancel()
  }

  return(
    enabled ?
      <div className='author-input'>
        <div className='center-item'>
          <h3>Create New Memory</h3>
          <div className='input-element'>
            <input type='text' 
              placeholder='Enter your name' 
              value={name}
              onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className='button-group'>
            <button onClick={() => onCancelButtonPressed()}>Cancel</button>
            <button onClick={() => onSave(name)} disabled={name.length < 2}>Create</button>
          </div>
        </div>
      </div>
    :
      <div className='author-input'>
        <div className='center-item'>
          <h3>Create New Memory</h3>
          <p>Can only record 5 memories on device. Please upload your recorded memories.</p>
          <div className='button-group'>
            <button onClick={() => onCancelButtonPressed()}>Ok</button>
          </div>
        </div>
      </div>
  )
}

export { AuthorInputComponent }