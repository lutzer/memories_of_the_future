import React, { useState, useEffect } from "react";
import './styles/photo_capture.scss'

const PhotoCaptureComponent = ({imageData, onCapture, onDelete} : {imageData? : Blob, onCapture : (blob: Blob) => void, onDelete : () => void}) => {
  const [image, setImage] = useState(null)

  useEffect( () => {
    setImage(imageData ? URL.createObjectURL(imageData) : null )

  },[imageData])

  function onInputChange(e : React.ChangeEvent<HTMLInputElement>) {
    const file : Blob = e.target.files[0]
    console.log(file)
    setImage(URL.createObjectURL(file))
    onCapture(file)
  }

  return(
    <div className='photo_capture'>
      { image ? 
        <div className='photo'>
          <img src={image}/>
          <button onClick={onDelete}>Delete Image</button>
        </div> 
      : 
        <div className='input'>
          <input onChange={onInputChange} type="file" name="image" accept="image/*" capture/>
        </div>
      }
    </div>
  )
}

export { PhotoCaptureComponent }