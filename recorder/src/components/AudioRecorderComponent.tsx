import React, { useState, useEffect } from "react";
import { getAudioRecorder, AudioRecording, AudioRecorder } from '../media/recorder'
import { CleanWebpackPlugin } from "clean-webpack-plugin";

enum RecorderState {
  INIT, RECORDING, BUSY, STOPPED, ERROR,
}

const AudioRecorderComponent = ({onSave} : {onSave : (rec: AudioRecording) => void}) => {
  const [recorderState, setRecorderState] = useState(RecorderState.INIT)
  const [recorder, setRecorder] = useState<AudioRecorder>(null)
  const [recording, setRecording] = useState<AudioRecording>(null)


  useEffect(() => {
    return function cleanup() {
      console.log('cleanup')
      if(recorder)
        recorder.stop();
    }
  },[])

  async function startRecording() {
    try {
      const recorder = await getAudioRecorder()
      setRecorderState(RecorderState.RECORDING)
      setRecorder(recorder)
      recorder.start()
    } catch (err) {
      console.error(err)
      setRecorderState(RecorderState.ERROR)
    }
  }

  async function stopRecording() {
    setRecorderState(RecorderState.BUSY)
    const recordedAudio = await recorder.stop();
    setRecording(recordedAudio)
    setRecorderState(RecorderState.STOPPED)
    setRecorder(null)
  }

  if (recorderState == RecorderState.INIT)
    return(
      <div>
        <button onClick={startRecording}>Start Recording</button>
      </div>
  )
  else if (recorderState == RecorderState.STOPPED )
      return(
      <div>
        <button onClick={startRecording}>Restart Recording</button>
        <button onClick={() => onSave(recording)}>Save Recording</button>
      </div>
      )
  else if (recorderState == RecorderState.RECORDING )
    return(
      <div>
        <button onClick={stopRecording}>Stop Recording</button>
      </div>
    )
  else if (recorderState == RecorderState.ERROR)
    return(
      <div>Error initializing recorder</div>
    )
  else 
      return(
        <div>Working...</div>
      )
}

export { AudioRecorderComponent }