import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getDatabase } from "../services/storage";
import { AudioRecorderComponent } from "./AudioRecorderComponent";
import { AudioRecording } from "../media/recorder";
import { PhotoCaptureComponent, PhotoViewComponent } from "./PhotoCaptureComponent";
import { LocationPickerComponent } from "./LocationPickerComponent";
import { TextInputComponent } from "./TextInputComponent";
import _ from "lodash";
import { dateFromNow } from "../utils/utils";

import './styles/input.scss'
import './styles/story.scss'
import { DeleteButtonComponent } from "./DeleteButtonComponent";
import { RecordSchema } from "../services/store";

function handleDbError(err : any) {
  console.log(err)
  if (err instanceof Error) showModal('Error', err.message)
}

type Properties = {
  onDelete : (id : string) => void
}

const RecordComponent = ({onDelete} : Properties) => {
  const [story, setStory] = useState<RecordSchema>(null)
  const history = useHistory();
  const { storyId } = useParams();

  useEffect(()=> {
    read()
  },[])

  async function read() {
    try {
      const db = await getDatabase()
      const val = await db.getRecord(storyId)
      setStory(val)
    } catch (err) {
      handleDbError(err)
    }
  }

  async function saveRecording(recording: AudioRecording) {
    try {
      const db = await getDatabase()
      const data : RecordSchema = Object.assign({}, story, { recording: recording})
      db.writeRecord(data)
      setStory(data)
    } catch (err) {
      handleDbError(err)
    }
  }

  async function deleteRecording() {
    try {
      const db = await getDatabase()
      const data : RecordSchema = Object.assign({}, story, { recording: null})
      db.writeRecord(data)
      setStory(data)
    } catch (err) {
      handleDbError(err)
    }
  }

  async function saveImage(image: Blob) {
    try {
      const db = await getDatabase()
      const data : RecordSchema = Object.assign({}, story, { image: image } )
      db.writeRecord(data)
      setStory(data)
    } catch (err) {
      handleDbError(err)
    }
  }

  async function deleteImage() {
    try {
      const db = await getDatabase()
      const data : RecordSchema = Object.assign({}, story, { image: null})
      db.writeRecord(data)
      setStory(data)
    } catch (err) {
      handleDbError(err)
    }
  }

  const updateText = _.debounce( async (text : string) => {
    try {
      const db = await getDatabase()
      const data : RecordSchema = Object.assign({}, story, { text: text})
      db.writeRecord(data)
      setStory(data)
    } catch (err) {
      handleDbError(err)
    }
  },500)

  async function updateLocation(loc : [number, number]) {
    try {
      const db = await getDatabase()
      const data : RecordSchema = Object.assign({}, story, { location: loc})
      db.writeRecord(data)
      setStory(data)
    } catch (err) {
      handleDbError(err)
    }
  }


  return (
    story ?
      !story.uploaded ? 
        <div className="story">
          <h3>Memory of {story.projectName}</h3>
          <div className='item info'>
            <div className='item-content'>
            <p>Created {dateFromNow(story.createdAt)} by <span className='author'>{story.author}</span>.</p>
            <TextInputComponent text={story.text} onChange={updateText}/>
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
          <div className='item location'> 
            <LocationPickerComponent location={story.location} onPick={updateLocation}/>
          </div>
          <div className='button-group'>
            <DeleteButtonComponent text='Delete Memory' onConfirm={() => { onDelete(storyId) }}/>
            <button onClick={() => history.push(`/${story.projectName}/upload/${story.id}`)} disabled={!story.recording || !story.image || !story.location}>Upload</button>
            <p> </p>
          </div>
        </div>
      :
      <div className="story">
        <h3>Memory of {story.projectName}</h3>
        <div className='item info'>
          <div className='item-content'>
          <p>Created {dateFromNow(story.createdAt)} by <span className='author'>{story.author}</span>.</p>
          </div>
        </div>
        <div className='item camera'>
          <PhotoViewComponent imageData={story.image}/>
        </div>
        <p>Memory has been uploaded.</p>
        <button onClick={() => { onDelete(storyId) }}>Delete from Device</button>
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

export { RecordComponent }
