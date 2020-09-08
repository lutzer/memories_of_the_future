import React, { useState, useEffect } from "react";
import './styles/input.scss'

type Properties = {
  text? : string, 
  disabled? : boolean, 
  rows?: number, 
  maxLength? : number, 
  placeholder : string, 
  onChange : (text: string) => void
}

const TextInputComponent = ({text = '', placeholder, maxLength=512, disabled = false, rows=1, onChange} : Properties ) => {
  const [expanded, setExpand] = useState(false)

  function onTextAreaChange(text: string){
    onChange(text)
  }

  return(
    <div className='text-input'>
      <div className='input-element'>
        <textarea id='w3mission' 
          rows={expanded ? rows : 1} 
          cols={50} 
          placeholder={placeholder} 
          defaultValue={text}
          onChange={(e) => onTextAreaChange(e.target.value)}
          onFocus={() => setExpand(true)}
          onBlur={() => setExpand(false)}
          maxLength={maxLength}
          disabled={disabled}>
        </textarea>
      </div>
    </div>
  )
}

export { TextInputComponent }