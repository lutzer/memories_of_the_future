import React, { useState, useEffect } from "react";
import { getAudioRecorder } from './../media/recorder'
import { getDatabase } from '../storage/database'

enum RecorderState {
  INIT, RECORDING, BUSY, STOPPED, ERROR,
}

const RecorderComponent = () => {
  const [recorderState, setRecorderState] = useState(RecorderState.INIT)
  const [recorder, setRecorder] = useState(null)

  function startRecording() {
    (async function () {
      try {
        const recorder = await getAudioRecorder()
        setRecorderState(RecorderState.RECORDING)
        setRecorder(recorder)
        recorder.start()
      } catch (err) {
        console.error(err)
        setRecorderState(RecorderState.ERROR)
      }
    })()
  }

  function stopRecording() {
    (async function () {
      setRecorderState(RecorderState.BUSY)
      const audio = await recorder.stop();
      audio.play();
      setRecorderState(RecorderState.STOPPED)
    })()
  }

  if (recorderState == RecorderState.INIT || recorderState == RecorderState.STOPPED )
    return(
      <div>
        <button onClick={startRecording}>Start Recording</button>
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