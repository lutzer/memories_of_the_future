import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getDatabase, StorySchema } from "../services/storage";
import { AudioRecorderComponent } from "./AudioRecorderComponent";
import { AudioRecording } from "../media/recorder";
import { AudioPlayerComponent } from "./AudioPlayerComponent";
import { PhotoCaptureComponent } from "./PhotoCaptureComponent";
import moment from 'moment';

import './styles/story.scss'
import { LocationPickerComponent } from "./LocationPickerComponent";
import { Api } from "../services/api";

const StoryComponent = () => {
  const [story, setStory] = useState<StorySchema>(null)
  const { storyId } = useParams();
  const history = useHistory();

  useEffect(()=> {
    read()
  },[])

  async function read() {
    try {
      const db = await getDatabase()
      const val = await db.getStory(storyId)
      setStory(val)
    } catch (err) {
      console.error(err)
    }
  }

  async function saveRecording(recording: AudioRecording) {
    try {
      const db = await getDatabase()
      const data : StorySchema = Object.assign({}, story, { recording: recording.blob})
      db.writeStory(data)
      setStory(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteRecording() {
    try {
      const db = await getDatabase()
      const data : StorySchema = Object.assign({}, story, { recording: null})
      db.writeStory(data)
      setStory(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function saveImage(image: Blob) {
    try {
      const db = await getDatabase()
      const data : StorySchema = Object.assign({}, story, { image: image})
      db.writeStory(data)
      setStory(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteImage() {
    try {
      const db = await getDatabase()
      const data : StorySchema = Object.assign({}, story, { image: null})
      db.writeStory(data)
      setStory(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteStory() {
    try {
      const db = await getDatabase()
      db.removeStory(storyId)
      history.push('/stories')
    } catch (err) {
      console.error(err)
    }
  }

  async function updateLocation(loc : [number, number]) {
    try {
      const db = await getDatabase()
      const data : StorySchema = Object.assign({}, story, { location: loc})
      db.writeStory(data)
      setStory(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function uploadStory() {
    try {
      await Api.uploadStory(story)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="story">
      { story ?
        <div className='details'>
          <div className='info'>
            <p>{moment(story.createdAt).fromNow()}</p>
            <p>Author: {story.author}</p>
            <p>project: {story.projectId}</p>
          </div>
          <div className='recorder'>
          { story.recording ?
            <div className='player'>
               <AudioPlayerComponent audioData={story.recording}/>
               <button onClick={deleteRecording}>Delete Recording</button>
            </div>
            : <AudioRecorderComponent onSave={(rec) => saveRecording(rec)}/>
          }
          </div>
          <div className='camera'>
            <PhotoCaptureComponent imageData={story.image} onCapture={saveImage} onDelete={deleteImage}/>
          </div>
          <div className='location'> 
            <LocationPickerComponent location={story.location} onPick={updateLocation}/>
          </div>
          <button onClick={deleteStory}>Delete Story</button>
          <button onClick={uploadStory}>Upload Story</button>
        </div>
      :
          <div className='placeholder'>
            <p>This memory was forgotten.</p>
            <button onClick={() => history.push('/stories/')}>Back</button>
          </div>
      }
    </div>
  )
}

export { StoryComponent }
