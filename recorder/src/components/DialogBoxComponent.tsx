import React, { useState, useEffect, FunctionComponent } from "react";
import './styles/dialog.scss'

type Properties = {
  close? : boolean
}

const DialogBoxComponent : FunctionComponent<Properties> = ({children, close = false}) => {
  const [ closed, setClosed ] = useState(true)


  useEffect( () => {
    setClosed(close)
  }, [])

  return(
    <div className='dialog-box-overlay'>
      <div className={ closed ? 'dialog-box closed' : 'dialog-box'}>
        <div className='inner-container'>
          {children}
        </div>
      </div>
    </div>
  )
}

export { DialogBoxComponent }