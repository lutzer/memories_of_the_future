import React, { useState, useEffect } from "react";
import './styles/input.scss'

const TextInputComponent = ({text = '', disabled = false, onChange} : 
  { text? : string, disabled? : boolean, onChange : (text: string) => void } ) => {
  const [expanded, setExpand] = useState(false)

  function onTextAreaChange(text: string){
    onChange(text)
  }

  return(
    <div className='text-input'>
      <div className='input-element'>
        <textarea id='w3mission' 
          rows={expanded ? 6 : 1} 
          cols={50} 
          placeholder='Say something about your memory.' 
          defaultValue={text}
          onChange={(e) => onTextAreaChange(e.target.value)}
          onFocus={() => setExpand(true)}
          onBlur={() => setExpand(false)}
          maxLength={512}
          disabled={disabled}>
        </textarea>
      </div>
    </div>
  )
}

export { TextInputComponent }