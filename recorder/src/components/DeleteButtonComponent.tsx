import React, { useEffect, useState } from "react";

import './styles/main.scss'
import './styles/input.scss'

const DeleteButtonComponent = ({ text = 'Delete', confirmText = 'Sure?', onConfirm} : 
{ text? : string, confirmText? : string, onConfirm : () => void}) => {
  const [clicked, setClicked] = useState(false)

  useEffect( () => {
    let timer = clicked ? setTimeout( () => {
      setClicked(false);
    },2000) : null
    return function cleanup() {
      clearTimeout(timer)
    }
  }, [clicked])

  function onClick() {
    if (clicked) {
      onConfirm()
      setClicked(false)
    } else {
      setClicked(true)
    }
  }
  
  return(
    <button className={ clicked ? 'button-delete' : ''} onClick={onClick}>{clicked ? confirmText : text}</button>
  )
}

export { DeleteButtonComponent }