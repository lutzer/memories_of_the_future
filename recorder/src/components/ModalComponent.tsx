import React, { useEffect, useState } from "react";
import './styles/modal.scss'

type ModalProperties = {
  title: string,
  text: string,
  onAccept: () => void,
  onCancel?: () => void
}

const ModalComponent = (props : ModalProperties) => {
  
  return(
    <div className='modal'>
      <div className='dialog'>
        <h3>{props.title}</h3>
        <p>{props.text}</p>
        { props.onCancel && <button onClick={props.onCancel}>Cancel</button> }
        <button onClick={props.onAccept}>Ok</button>
      </div>
    </div>
  )
}

export { ModalComponent, ModalProperties }