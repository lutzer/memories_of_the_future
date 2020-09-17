import React, { useState, useEffect, FunctionComponent } from "react"
import { useHistory } from "react-router-dom";
import './styles/slider.scss'

import CloseIconImg from './../assets/icon_close.png'

type Properties = {
  closePath? : string,
  onClose? : () => void,
  fullscreen? : boolean
}

const DragHandleComponent = ({onDrag} : { onDrag : (x : number, y: number) => void}) => {
  const [ mouseDown, setMouseDown ] = useState(false)

  function onMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (event.button == 1)
      setMouseDown(true)
  }

  function onMouseUp(event : React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (event.button == 1)
      setMouseDown(false)
  }

  function onMouseMove(event : React.MouseEvent<HTMLDivElement, MouseEvent>) {
      console.log(['mouse-move', event])
  }

  return(
    <div className='drag-handle' onMouseMove={onMouseMove} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      <div></div>
    </div>
  )
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
      <div className={'slide-close-button' + (!fullscreen ? ' detached' : '')}>
        <button onClick={onCloseButtonPressed}>
          <img src={CloseIconImg}/>
        </button>
      </div>
      {/* <DragHandleComponent onDrag={() => {}}/> */}
      <div className='slide-inner-container'>
        
        {children}
      </div>
    </div>
  )
}

export { SlideContainerComponent }