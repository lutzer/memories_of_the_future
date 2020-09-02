import React, { useState, useEffect, FunctionComponent } from "react";
import { useHistory } from "react-router-dom";
import './styles/slider.scss'

type Properties = {
  closePath? : string,
  onClose? : () => void,
  fullscreen? : boolean
}

const SlideContainerComponent : FunctionComponent<Properties> = ({fullscreen = true, children, closePath = null, onClose = () => {} }) => {
  const [ closed, setClosed ] = useState(true)

  const history = useHistory();

  //close
  function onCloseButtonPressed() {
    setClosed(true)
    onClose()
    setTimeout( () => {
      history.push(closePath || "./");
    },500)
  }

  // open
  useEffect( () => {
    setTimeout( () => {
      setClosed(false)
    }, 10);
  }, [])

  return(
    <div className={ 'slide-container' + (fullscreen ? ' fullscreen' : ' halfscreen') + (closed ? ' closed' : '') }>
      <div className='slide-close-button'>
        <button onClick={onCloseButtonPressed}>Close</button>
      </div>
      <div className='slide-inner-container'>
        
        {children}
      </div>
    </div>
  )
}

export { SlideContainerComponent }