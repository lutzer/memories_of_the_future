import React, { useState, useEffect } from "react";
import { getAudioRecorder, AudioRecording, AudioRecorder } from '../media/recorder'
import { CleanWebpackPlugin } from "clean-webpack-plugin";

import './styles/input.scss'
import './styles/recorder.scss'

const AudioPlayerComponent = ({audioData} : {audioData : Blob}) => {
  const [audioUrl, setAudioUrl] = useState(null)

  useEffect( () => {
    if (audioData)
      setAudioUrl(URL.createObjectURL(audioData))
  },[audioData])

  return(
    <div className='audio-player'>
      <audio
        controls
        src={audioUrl}>
            Your browser does not support the
            <code>audio</code> element.
      </audio>
    </div>
  )
}

const AudioRecorderComponent = ({onSave, onDelete, recording} :
  {onSave : (rec: AudioRecording) => void, onDelete : () => void, recording? : Blob}) => {
  const [recorder, setRecorder] = useState<AudioRecorder>(null)
  const [isRecording, setIsRecording] = useState<boolean>(false)


  useEffect(() => {
    return function cleanup() {
      console.log('cleanup')
      if(recorder)
        recorder.stop();
    }
  },[])

  async function startRecording() {
    try {
      setIsRecording(true)
      const recorder = await getAudioRecorder()
      setRecorder(recorder)
      recorder.start()
    } catch (err) {
      console.error(err)
      if (err instanceof Error)
        window.showModal("Error",err.message)
      setIsRecording(false)
    }
  }

  async function stopRecording() {
    try {
      const recordedAudio = await recorder.stop();
      onSave(recordedAudio)
      setRecorder(null)
      setIsRecording(false)
    } catch (err) {
      console.error(err)
      if (err instanceof Error)
        window.showModal("Error",err.message)
      setIsRecording(false)
    }
  }

  return (
    recording ?
      <div className='recorder'>
        <AudioPlayerComponent audioData={recording}/>
        <button onClick={onDelete}>Delete Recording</button>
      </div>
    :
    <div className='recorder'>
      { !isRecording ?
        <button onClick={startRecording}>Start Recording</button>
      :
        <button onClick={stopRecording}>Stop Recording</button>
      }
    </div>
    
  )
}

export { AudioRecorderComponent }