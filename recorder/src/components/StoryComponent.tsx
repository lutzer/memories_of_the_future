import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getDatabase, StorySchema } from "../services/storage";
import { AudioRecorderComponent } from "./AudioRecorderComponent";
import { AudioRecording } from "../media/recorder";
import { PhotoCaptureComponent } from "./PhotoCaptureComponent";
import moment from 'moment';
import { LocationPickerComponent } from "./LocationPickerComponent";
import { Api } from "../services/api";

import './styles/input.scss'
import './styles/story.scss'
import { ProjectViewComponent } from "./ProjectViewComponent";
import { TextInputComponent } from "./TextInputComponent";
import _ from "lodash";


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
      const data : StorySchema = Object.assign({}, story, { recording: recording})
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

  const updateText = _.debounce( async (text : string) => {
    try {
      const db = await getDatabase()
      const data : StorySchema = Object.assign({}, story, { text: text})
      db.writeStory(data)
      setStory(data)
    } catch (err) {
      console.error(err)
    }
  },500)

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
    story ?
      <div className="story">
        <h2>Memory of {story.projectName}</h2>
        <div className='item info'>
          <div className='item-content'>
          <p>Created {moment(story.createdAt).fromNow()} by <span className='author'>{story.author}</span>.</p>
          </div>
        </div>
        <div className='item recorder'>
          <div className='item-content'>
            <AudioRecorderComponent onSave={(rec) => saveRecording(rec)} onDelete={deleteRecording} recording={story.recording}/>
          </div>
        </div>
        <div className='item camera'>
          <PhotoCaptureComponent imageData={story.image} onCapture={saveImage} onDelete={deleteImage}/>
        </div>
        <div className='item text'> 
          <TextInputComponent text={story.text} onChange={updateText}/>
        </div>
        <div className='item location'> 
          <LocationPickerComponent location={story.location} onPick={updateLocation}/>
        </div>
        <div className='button-group'>
          <button onClick={deleteStory}>Delete</button>
          <button onClick={uploadStory} disabled={!story.recording || !story.image || !story.location}>Upload</button>
        </div>
      </div>
    :
      <div className="story center">
        <div className='center-item'>
          <p>This memory was forgotten.</p>
          <button onClick={() => history.push('/stories/')}>Back</button>
        </div>
      </div>
  )
}

export { StoryComponent }
