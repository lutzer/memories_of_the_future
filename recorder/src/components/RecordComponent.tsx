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
import './styles/record.scss'
import { DeleteButtonComponent } from "./DeleteButtonComponent";
import { RecordSchema } from "../services/store";

type Properties = {
  onDelete : (id : string) => void
  onChange : (record: RecordSchema) => void
  records: RecordSchema[]
}

const RecordComponent = ({records, onDelete, onChange} : Properties) => {
  const history = useHistory();
  const { storyId } = useParams();
  const [ record, setRecord ] = useState(null)

  useEffect(() => {
    setRecord(_.find(records,{id: storyId}))
  },[storyId, records])

  useEffect(() => {
    if (record)
      onChange(record)
  },[record])

  function saveRecording(recording: AudioRecording) {
    setRecord(Object.assign({} ,record, { recording: recording}))
  }

  function deleteRecording() {
    setRecord(Object.assign({}, record, { recording: null}))
  }

  function saveImage(image: Blob) {
    setRecord(Object.assign({}, record, { image: image } ))
  }

  async function deleteImage() {
    setRecord(Object.assign({}, record, { image: null}))
  }

  const updateText = _.debounce( async (text : string) => {
    setRecord(Object.assign({}, record, { text: text}))
  },500)

  async function updateLocation(loc : [number, number]) {
    setRecord(Object.assign({}, record, { location: loc}))
  }

  return (
    record ?
      !record.uploaded ? 
        <div className="record">
          <h3>Memory of {record.projectName}</h3>
          <div className='item info'>
            <div className='item-content'>
            <p>Created {dateFromNow(record.createdAt)} by <span className='author'>{record.author}</span>.</p>
            <TextInputComponent text={record.text} onChange={updateText}/>
            </div>
          </div>
          <div className='item recorder'>
            <div className='item-content'>
              <AudioRecorderComponent onSave={(rec) => saveRecording(rec)} onDelete={deleteRecording} recording={record.recording}/>
            </div>
          </div>
          <div className='item camera'>
            <PhotoCaptureComponent imageData={record.image} onCapture={saveImage} onDelete={deleteImage}/>
          </div>
          <div className='item location'> 
            <LocationPickerComponent location={record.location} onPick={updateLocation}/>
          </div>
          <div className='button-group'>
            <DeleteButtonComponent text='Delete Memory' onConfirm={() => { onDelete(record.id) }}/>
            <button onClick={() => history.push(`/${record.projectName}/upload/${record.id}`)} disabled={!record.recording || !record.image || !record.location}>Upload</button>
          </div>
        </div>
      :
      <div className="record">
        <h3>Memory of {record.projectName}</h3>
        <div className='item info'>
          <div className='item-content'>
          <p>Created {dateFromNow(record.createdAt)} by <span className='author'>{record.author}</span>.</p>
          </div>
        </div>
        <div className='item camera'>
          <PhotoViewComponent imageData={record.image}/>
        </div>
        <p>Memory has been uploaded.</p>
        <button onClick={() => { onDelete(storyId) }}>Delete from Device</button>
      </div>
    :
      <div className="record center">
        <div className='center-item'>
          <p>This memory was forgotten.</p>
          <button onClick={() => history.push('./../')}>Back</button>
        </div>
      </div>
  )
}

export { RecordComponent }
