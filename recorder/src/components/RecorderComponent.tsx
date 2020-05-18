import React, { useState } from "react";
import { getAudioRecorder, AudioRecording, AudioRecorder } from './../media/recorder'

enum RecorderState {
  INIT, RECORDING, BUSY, STOPPED, ERROR,
}

const RecorderComponent = ({onSave} : {onSave : (rec: AudioRecording) => void}) => {
  const [recorderState, setRecorderState] = useState(RecorderState.INIT)
  const [recorder, setRecorder] = useState<AudioRecorder>(null)
  const [recording, setRecording] = useState<AudioRecording>(null)

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

export { RecorderComponent }