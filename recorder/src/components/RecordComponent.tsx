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
  record: RecordSchema
}

const RecordComponent = ({record, onDelete, onChange} : Properties) => {
  const history = useHistory();
  const [ recordData, setRecordData ] = useState(record)

  useEffect(() => {
    if (recordData)
      onChange(recordData)
  },[recordData])

  function saveRecording(recording: AudioRecording) {
    setRecordData(Object.assign({} ,record, { recording: recording}))
  }

  function deleteRecording() {
    setRecordData(Object.assign({}, record, { recording: null}))
  }

  function saveImage(image: Blob) {
    setRecordData(Object.assign({}, record, { image: image } ))
  }

  async function deleteImage() {
    setRecordData(Object.assign({}, record, { image: null}))
  }

  const updateText = _.debounce( async (text : string) => {
    setRecordData(Object.assign({}, record, { text: text}))
  },500)

  const updateTitle = _.debounce( async (title : string) => {
    setRecordData(Object.assign({}, record, { title: title}))
  },500)

  async function updateLocation(loc : [number, number]) {
    setRecordData(Object.assign({}, record, { location: loc}))
  }

  const uploadEnabled = function() {
    return record.recording && record.image && record.location && record.title.length > 3
  }

  return (
    record ?
      !record.uploaded ? 
        <div className="record">
          <h2 className='slideheader'>Memory of {record.projectName}</h2>
          <div className='item'>
            <TextInputComponent maxLength={64} placeholder='Title of the memory' text={record.title} onChange={updateTitle}/>
          </div>
          <div className='item info'>
            <div className='item-content'>
            <p>Created {dateFromNow(record.createdAt)} by <span className='author'>{record.author}</span>.</p>
            <TextInputComponent placeholder='Say something about your memory.' text={record.text} rows={6} onChange={updateText}/>
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
            <button onClick={() => history.push(`/${record.projectName}/upload/${record.id}`)} disabled={!uploadEnabled()}>Upload</button>
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
        <button onClick={() => { onDelete(record.id) }}>Delete from Device</button>
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
