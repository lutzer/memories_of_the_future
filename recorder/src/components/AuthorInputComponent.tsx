import React, { useState, useEffect } from "react";
import { DialogBoxComponent } from "./DialogBoxComponent";
import { useHistory } from "react-router-dom";

import './styles/input.scss'

const AuthorInputComponent = ({onCancel, onAccept, enabled} : 
  { onCancel: () => void, onAccept : (name: string) => void, enabled : boolean}) => {
  const [name, setName] = useState('')

  function onCancelButtonPressed() {
    onCancel()
  }

  function onKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    var code = event.keyCode || event.which;
    if(code === 13 && !isDisabled()) { //enter pressed
      onAccept(name)
    } 
  }

  function isDisabled() {
    return name.length < 2
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
              onChange={(e) => setName(e.target.value)}
              onKeyPress={onKeyPress}/>
          </div>
          <div className='button-group'>
            <button onClick={() => onCancelButtonPressed()}>Cancel</button>
            <button onClick={() => onAccept(name)} disabled={isDisabled()}>Create</button>
          </div>
        </div>
      </div>
    :
      <div className='author-input'>
        <h3>Create New Memory</h3>
        <p>You can record a maximum of 5 memories on this device. Please upload and delete your recorded memories.</p>
        <div className='button-group'>
          <button onClick={() => onCancelButtonPressed()}>Ok</button>
        </div>
      </div>
  )
}

export { AuthorInputComponent }