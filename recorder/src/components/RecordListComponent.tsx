import React, { useEffect, useState } from "react";
import { getDatabase} from "../services/storage";
import { Link, useParams } from "react-router-dom";
import _, { isEmpty } from 'lodash'
import { config } from "../config";
import { dateFromNow } from "../utils/utils";

import './styles/record.scss'
import './styles/input.scss'
import { RecordSchema, ProjectSchema, Store } from "../services/store";

type Properties = {
  project : ProjectSchema
  records : RecordSchema[]
}

const RecordListComponent = ({project, records} : Properties) => {

  const draftRecords = records.filter((record) => {
    return record.uploaded == false
  })

  const uploadedRecords = records.filter((record) => {
    return record.uploaded == true
  })

  function renderDrafts() {
    return(
      draftRecords.map( (record: RecordSchema, i) => {
        return( 
          <div key={i} className='item'>
            <Link to={`/${project.name}/records/${record.id}`}>
              <div className='item-content'>
              <h3>{_.isEmpty(record.title) ? 'unnamed' : record.title}{record.uploaded ? ' (uploaded)' : ''}</h3>
              <p>
              created {dateFromNow(record.createdAt)} by <span className='author'>{record.author || 'unknown'} in {record.projectName}.</span>
              </p>
            </div>
            </Link>
          </div>
        )
      })
    )
  }


  function renderUploadedRecords() {
    return(
      uploadedRecords.map( (record : RecordSchema, i) => {
        return(
          <div key={i} className='item uploaded'>
          <Link to={`/${project.name}/records/${record.id}`}>
            <div className='item-content'>
              <h3>{_.isEmpty(record.title) ? 'unnamed' : record.title}{record.uploaded ? ' (uploaded)' : ''}</h3>
            </div>
          </Link>
        </div>
        )
      })
    )
  }

  return (
    <div className="records-list">
      <h2 className='slideheader'>Drafts - {draftRecords.length}/{config.maxStories}</h2>
      { (isEmpty(draftRecords) && isEmpty(uploadedRecords)) &&
        <p>No drafts saved.</p>
      }
      { renderDrafts() }
      { renderUploadedRecords() }
      <Link className='button' to={`/${project.name}/add`}>Create new memory</Link>
    </div>
  )
    
    //   {
    //     !_.isEmpty(uploadedRecords) &&
    //     <div>
    //       <h2>Uploaded Records</h2>
    //       { uploadedRecords.map( (record : RecordSchema) => {
    //         return(
    //           <div key={i} className='item uploaded'>
    //           <Link to={`/${project.name}/records/${record.id}`}>
    //             <div className='item-content'>
    //             <h3>{_.isEmpty(record.title) ? 'unnamed' : record.title}{record.uploaded ? ' (uploaded)' : ''}</h3>
    //             <p>
    //             created {dateFromNow(record.createdAt)} by <span className='author'>{record.author || 'unknown'} in {record.projectName}.</span>
    //             </p>
    //           </div>
    //           </Link>
    //         </div>
    //         )
    //       })}
    //     </div>
    //   }
    //   {/* <button onClick={onAddStoryClicked} disabled={records.length >= config.maxStories}>Create Memory</button> */}
    // </div>
  // )
}

export { RecordListComponent }
