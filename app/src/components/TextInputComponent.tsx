import React, { useState } from "react";
import './styles/input.scss'

type Properties = {
  text? : string, 
  expands? : boolean
  disabled? : boolean, 
  rows?: number, 
  maxLength? : number, 
  placeholder : string, 
  onChange : (text: string) => void,
}

const TextInputComponent = ({text = '', expands = false, placeholder, maxLength=512, disabled = false, rows=1, onChange} : Properties ) => {
  const [expanded, setExpand] = useState(!expands)

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
          onFocus={() => { if (expands) setExpand(true) }}
          onBlur={() => { if (expands) setExpand(false) }}
          maxLength={maxLength}
          disabled={disabled}>
        </textarea>
      </div>
    </div>
  )
}

export { TextInputComponent }