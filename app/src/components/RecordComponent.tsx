import React, { useCallback, useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { getDatabase } from "../services/storage";
import { AudioRecorderComponent } from "./AudioRecorderComponent";
import { AudioRecording } from "../media/recorder";
import { ImageBlob, PhotoCaptureComponent, PhotoViewComponent } from "./PhotoCaptureComponent";
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
  defaultLocation : [number, number]
}

const RecordComponent = ({record, onDelete, onChange, defaultLocation} : Properties) => {
  const history = useHistory();
  const [ recordData, setRecordData ] = useState(record)
  const [ saved, isSaved ] = useState(false)

  useEffect(() => {
    if (recordData) {
      onChange(recordData)
    }
  },[recordData])

  function saveRecording(recording: AudioRecording) {
    isSaved(true)
    setRecordData(Object.assign({} ,record, { recording: recording}))
  }

  function deleteRecording() {
    isSaved(true)
    setRecordData(Object.assign({}, record, { recording: null}))
  }

  function saveImage(image: ImageBlob) {
    isSaved(true)
    setRecordData(Object.assign({}, record, { image: image } ))
  }

  function deleteImage() {
    isSaved(true)
    setRecordData(Object.assign({}, record, { image: null}))
  }

  function updateText(text : string) {
    isSaved(true)
    setRecordData(Object.assign({}, record, { text: text}))
  }

  function updateTitle(title : string) {
    isSaved(true)
    setRecordData(Object.assign({}, record, { title: title}))
  }

  async function updateLocation(loc : [number, number]) {
    isSaved(true)
    setRecordData(Object.assign({}, record, { location: loc}))
  }

  const uploadEnabled = function() {
    return (record.recording || record.image || record.text) && record.location && record.title.length > 2
  }

  return (
    record ?
      !record.uploaded ? 
        <div className="record">
          <h2 className='slideheader'>Memory of {record.projectName}</h2>
          <div className='item'>
            <p className='createdAt'>Created {dateFromNow(record.createdAt)} by <span className='author'>{record.author}</span>.</p>
          </div>
          <div className='item'>
            <TextInputComponent maxLength={64} placeholder='Name the memory' text={record.title} onChange={updateTitle}/>
          </div>
          <div className='item info'>
            <TextInputComponent placeholder='Say something about your memory.' text={record.text} rows={6} onChange={updateText}/>
          </div>
          <div className='item recorder'>
              <AudioRecorderComponent onSave={(rec) => saveRecording(rec)} onDelete={deleteRecording} recording={record.recording}/>
          </div>
          <div className='item camera'>
            <PhotoCaptureComponent imageData={record.image} onCapture={saveImage} onDelete={deleteImage}/>
          </div>
          <div className='item location'> 
            <LocationPickerComponent location={record.location} defaultLocation={defaultLocation} onPick={updateLocation}/>
          </div>
          { saved &&
          <div className='item saved'>
            <p>Changes have been saved.</p>
          </div>
           }
          <div className='button-group'>
            <DeleteButtonComponent text='Delete Memory' onConfirm={() => { onDelete(record.id) }}/>
            <button onClick={() => history.push(`/${record.projectName}/upload/${record.id}`)} disabled={!uploadEnabled()}>Upload</button>
          </div>
        </div>
      :
      <div className="record">
        <h3>Memory of {record.projectName}</h3>
        <div className='item'>
          <p className='createdAt'>Created {dateFromNow(record.createdAt)} by <span className='author'>{record.author}</span>.</p>
        </div>
        <p>Memory has been uploaded.</p>
        <div className='button-group'>
          <button onClick={() => history.push(`/${record.projectName}/stories/${record.id}`)}>Go to memory</button>
          <button onClick={() => { onDelete(record.id) }}>Remove from device</button>
        </div>
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
