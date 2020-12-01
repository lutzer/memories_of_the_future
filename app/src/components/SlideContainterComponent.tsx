/// resolves svg import errors in vs code
/// <reference path="./../custom.d.ts" />

import React, { useState, useEffect, FunctionComponent } from "react"
import { useHistory } from "react-router-dom";
import './styles/slider.scss'

import CloseIconImg from './../assets/cancel.svg'
import { sleep } from "../utils/utils";

type Properties = {
  closePath? : string,
  onClose? : () => void,
  fullscreen? : boolean
}

const DragHandleComponent = ({onDrag, threshold} : { onDrag : (x : number, y: number) => void, threshold : number}) => {
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
      const diff = [mouseDown[0] - pos[0], mouseDown[1] - pos[1]]
      if (Math.abs(diff[1]) > threshold) {
        onDrag( mouseDown[0] - pos[0], mouseDown[1] - pos[1])
        setMouseDown(null)
      }
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
  function closeSlider() {
    setClosed(true)
    onClose()
    setTimeout( () => {
      history.push(closePath || "./");
    },500)
  }

  async function onDragged(x: number, y: number) {

    if (y > 0 && !isFullscreen)
      setFullscreen(true)
    else if (y < 0  && isFullscreen)
      setFullscreen(false)
    else if (y < 0  && !isFullscreen)
      closeSlider()
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
        <button onClick={closeSlider}>
          <img src={CloseIconImg}/>
        </button>
      </div>
      <DragHandleComponent onDrag={onDragged} threshold={window.innerHeight * 0.1}/>
      <div className='slide-inner-container'>
        <div className='slide-inner-header'></div>
        {children}
      </div>
    </div>
  )
}

export { SlideContainerComponent }