/// resolves svg import errors in vs code
/// <reference path="./../custom.d.ts" />

import React, { useState, useEffect } from "react";
import { getAudioRecorder, AudioRecording, AudioRecorder } from '../media/recorder'
import { ProgressBarComponent } from "./ProgressBarComponent";
import { config } from "../config";
import { convertSecondsToMinuteString } from "../utils/utils";
import _ from "lodash";

import './styles/input.scss'
import './styles/recorder.scss'
import playArrow from './../assets/play.svg'
import pauseButton from './../assets/pause.svg'
import { DeleteButtonComponent } from "./DeleteButtonComponent";

type AudioPlayerproperties = {
  audioData? : AudioRecording, 
  audioUrl? : string
}

const AudioPlayerComponent = ({audioData = null, audioUrl = null} : AudioPlayerproperties) => {
  const [audio, setAudio] = useState<HTMLAudioElement>(null)
  const [playhead, setPlayhead] = useState<number>(0)
  const [playing, setPlaying] = useState<boolean>(false)
  const [duration, setDuration] = useState(0)
  const [reload, setReload] = useState(false)

  // load audio from url or blob
  useEffect( () => {
    var audioObj : HTMLAudioElement = null
    if (audioUrl) {
      audioObj = new Audio(audioUrl)
    } else if (audioData && _.has(audioData, 'blob')) {
      const url = URL.createObjectURL(audioData.blob)
      audioObj = new Audio(url)
    }

    // setup event handlers
    if (audioObj) {
      function durationChangeHandler(e : Event) {
        const ele = e.target as HTMLAudioElement
        setDuration(ele.duration == Infinity ? 0 : ele.duration * 1000)
      }
      function timeUpdateHandler(e: Event) {
        const ele = e.target as HTMLAudioElement
        setPlayhead(ele.duration == Infinity ? 0 : ele.currentTime * 1000)
      }
      function endedHandler(e: Event) {
        const ele = e.target as HTMLAudioElement
        setPlaying(false)
        setPlayhead(0)
        ele.currentTime = 0
      }
      audioObj.addEventListener('durationchange',durationChangeHandler)
      audioObj.addEventListener('ended', endedHandler)
      audioObj.addEventListener('timeupdate', timeUpdateHandler)
      setAudio(audioObj)

      // cleanup event handlers
      return function() {
        audioObj.removeEventListener('durationchange', durationChangeHandler)
        audioObj.removeEventListener('ended', endedHandler)
        audioObj.removeEventListener('timeupdate', timeUpdateHandler)
      }
    }
  },[audioUrl, audioData, reload])

  async function onPlayerClicked() {
    try {
      if (audio.paused) {
        setPlaying(true)
        await audio?.play()
      } else {
        setPlaying(false)
        await audio?.pause()
      }
    } catch (err) {
      setReload(!reload)
    }
  }

  const timeString = playhead > 0 ? convertSecondsToMinuteString(playhead / 1000) : convertSecondsToMinuteString(duration / 1000)
  const progress = audio ? playhead / duration : 0

  return(
    <div className='audio-player' onClick={() => onPlayerClicked()}>
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

export { AudioRecorderComponent, AudioPlayerComponent }