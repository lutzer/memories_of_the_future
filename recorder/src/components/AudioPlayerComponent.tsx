import React, { useState, useEffect } from "react";

enum RecorderState {
  INIT, RECORDING, BUSY, STOPPED, ERROR,
}

const AudioPlayerComponent = ({audioData} : {audioData : Blob}) => {
  const [audioUrl, setAudioUrl] = useState(null)

  useEffect( () => {
    setAudioUrl(URL.createObjectURL(audioData))
  },[audioData])

  return(
    <div>
      <audio
        controls
        src={audioUrl}>
            Your browser does not support the
            <code>audio</code> element.
      </audio>
    </div>
  )
}

export { AudioPlayerComponent }