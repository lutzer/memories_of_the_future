import React, { useState, useEffect } from "react";
import './styles/photo_capture.scss'

type ImageBlob = Blob

const PhotoViewComponent = ({imageData} : {imageData? : ImageBlob}) => {
  const [image, setImage] = useState(null)

  useEffect( () => {
    setImage(imageData ? URL.createObjectURL(imageData) : null )
  },[imageData])

  return(
    <div className='photo_capture'>
      { image ? 
        <div className='photo'>
          <img src={image}/>
          <div className='input'>
          </div>
        </div> 
      : 
        <div>
          <div className='placeholder'>
            No Picture
          </div>
        </div>
      }
    </div>
  )
}


const PhotoCaptureComponent = ({imageData, onCapture, onDelete} : {imageData? : ImageBlob, onCapture : (img: ImageBlob) => void, onDelete : () => void}) => {
  const [image, setImage] = useState(null)

  useEffect( () => {
    setImage(imageData ? URL.createObjectURL(imageData) : null )

  },[imageData])

  function onInputChange(e : React.ChangeEvent<HTMLInputElement>) {
    const file : Blob = e.target.files[0]
    setImage(URL.createObjectURL(file))
    onCapture(file)
  }

  return(
    <div className='photo_capture'>
      { image ? 
        <div className='photo'>
          <img src={image}/>
          <div className='input'>
            <button onClick={onDelete}>Delete Image</button>
          </div>
        </div> 
      : 
        <div>
          <div className='placeholder'>
            Add a picture
          </div>
          <div className='input'>
            <label htmlFor='cameraInput'><button style={{ pointerEvents : 'none'}}>Take Picture</button></label>
            <input id='cameraInput' style={{display : 'none'}} onChange={onInputChange} type="file" name="image" accept="image/*"/>
          </div>
        </div>
      }
    </div>
  )
}

export { PhotoCaptureComponent, PhotoViewComponent }
export type { ImageBlob }