import React, { useState, useEffect } from "react";
import { getAudioRecorder, AudioRecording, AudioRecorder } from '../media/recorder'
import { ProgressBarComponent } from "./ProgressBarComponent";
import { config } from "../config";
import { convertSecondsToMinuteString } from "../utils/utils";
import _ from "lodash";

import './styles/input.scss'
import './styles/recorder.scss'
import playArrow from './../assets/play-arrow.png'
import pauseButton from './../assets/pause-button.png'
import { DeleteButtonComponent } from "./DeleteButtonComponent";

const AudioPlayerComponent = ({audioData} : {audioData : AudioRecording}) => {
  const [audio, setAudio] = useState<HTMLAudioElement>(null)
  const [playhead, setPlayhead] = useState<number>(0)
  const [playing, setPlaying] = useState<boolean>(false)

  useEffect( () => {
    if (audioData && _.has(audioData, 'blob')) {
      const url = URL.createObjectURL(audioData.blob)
      const audioObj = new Audio(url)
      setAudio(audioObj)
      audioObj.onended = resetAudio
    }
  },[audioData])

  useEffect( () => {
    if (!audio)
      return

    var watchId : NodeJS.Timeout = null
    if (playing) {
      audio.play()
      watchId = setInterval(() => {
        setPlayhead(audio ? audio.currentTime * 1000 : 0)
      },50)
    } else {
      audio.pause()
    }
    return function cleanup() {
      if (audio) audio.pause()
      if (watchId) clearInterval(watchId)
    }
  },[playing])

  function resetAudio() {
    setPlaying(false)
    setPlayhead(audioData.duration)
    if (audio)
      audio.currentTime = 0
  }

  const timeString = convertSecondsToMinuteString(playhead / 1000) 
  const progress = audioData ? playhead / audioData.duration : 0

  return(
    <div className='audio-player' onClick={() => setPlaying(!playing)}>
      <div className='play-button'>
        { playing? <img src={pauseButton}/> : <img src={playArrow}/> }
      </div>
      <div className='bar'>
        <ProgressBarComponent progress={progress}/>
      </div>
      <div className='number'>{timeString}</div>
    </div>
  )
}

const AudioRecorderComponent = ({onSave, onDelete, recording} :
  {onSave : (rec: AudioRecording) => void, onDelete : () => void, recording? : AudioRecording}) => {
  const [recorder, setRecorder] = useState<AudioRecorder>(null)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    return function cleanup() {
      if(recorder)
        recorder.stop();
    }
  },[])

  // starts timer when record is started
  useEffect(() => {
      var watchId : NodeJS.Timeout = null
      if (recorder) {
        watchId = setInterval(() => {
          var p = recorder.getTime() / (config.maxRecordingDuration * 1000)
          setProgress(p)
          if (p >= 1.0)
            stopRecording()
        },50)
      }
      return function cleanup() {
        if (watchId) clearInterval(watchId)
      }
  },[recorder])

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
      setProgress(0)
    } catch (err) {
      console.error(err)
      if (err instanceof Error)
        window.showModal("Error",err.message)
      setIsRecording(false)
    }
  }

  var timeRemaining = convertSecondsToMinuteString(Math.round(config.maxRecordingDuration - progress * config.maxRecordingDuration))

  return (
    recording ?
      <div className='recorder'>
        <AudioPlayerComponent audioData={recording}/>
        <DeleteButtonComponent text='Delete Recording' onConfirm={onDelete}/>
      </div>
    :
    <div className='recorder'>
      <div className='recording-time'>
        <div className='bar'>
          <ProgressBarComponent progress={progress}/>
        </div>
        <div className='number'>{timeRemaining}</div>
      </div>
      { !isRecording ?
        <button onClick={startRecording}>Start Recording</button>
      :
        <button onClick={stopRecording}>Stop Recording</button>
      }
    </div>
    
  )
}

export { AudioRecorderComponent }