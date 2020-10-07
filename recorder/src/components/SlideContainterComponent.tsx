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
  const [ mouseDown, setMouseDown ] = useState<[number, number]>(null)
  

  function onMouseDown(event: React.TouchEvent<HTMLDivElement>) {
    const pos : [number, number] = [event.touches[0].screenX, event.touches[0].screenY]
    setMouseDown(pos)
  }

  function onMouseUp(event : React.TouchEvent<HTMLDivElement>) {
    setMouseDown(null)
  }

  function onMouseMove(event : React.TouchEvent<HTMLDivElement>) {
    if (mouseDown) {
      const pos : [number, number] = [event.touches[0].screenX, event.touches[0].screenY]
      onDrag( mouseDown[0] - pos[0], mouseDown[1] - pos[1])
    }
  }

  return(
    <div className='drag-handle' onTouchMove={onMouseMove} onTouchStart={onMouseDown} onTouchEnd={onMouseUp}>
      <div></div>
    </div>
  )
}


const SlideContainerComponent : FunctionComponent<Properties> = ({fullscreen = true, children, closePath = null, onClose = () => {} }) => {
  const [ closed, setClosed ] = useState(true)
  const [ isFullscreen, setFullscreen ] = useState(fullscreen)

  const history = useHistory();

  //close
  function onCloseButtonPressed() {
    setClosed(true)
    onClose()
    setTimeout( () => {
      history.push(closePath || "./");
    },500)
  }

  function onDragged(x: number, y: number) {
    if (y > window.innerHeight * 0.1 && !isFullscreen)
      setFullscreen(true)
    else if (y < -window.innerHeight * 0.1  && isFullscreen)
      setFullscreen(false)
  }

  // open
  useEffect( () => {
    setTimeout( () => {
      setClosed(false)
    }, 10);
  }, [])

  return(
    <div className={ 'slide-container' + (isFullscreen ? ' fullscreen' : ' halfscreen') + (closed ? ' closed' : '') }>
      <div className={'slide-close-button' + (!isFullscreen ? ' detached' : '') + (closed ? ' closed' : '')}>
        <button onClick={onCloseButtonPressed}>
          <img src={CloseIconImg}/>
        </button>
      </div>
      <DragHandleComponent onDrag={onDragged}/>
      <div className='slide-inner-container'>
        
        {children}
      </div>
    </div>
  )
}

export { SlideContainerComponent }