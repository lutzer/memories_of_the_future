import React, { useEffect, useState } from "react";
import { getDatabase} from "../services/storage";
import { Link, useParams } from "react-router-dom";
import _ from 'lodash'
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

  return (
    _.isEmpty(records) ?
      <div className="records-list center">
        <div className='center-item'>
          <p>No memories saved.</p>
          <Link className='button' to={`/${project.name}/add`}>Create Memory</Link>
        </div>
      </div>
    : 
    <div className="records-list">
      <h3>Memories - {records.length}/{config.maxStories}</h3>
      { records.map( (record: RecordSchema, i) => {
        return( 
          <div key={i} className={record.uploaded? 'item uploaded': 'item'}>
            <Link to={`/${project.name}/records/${record.id}`}>
              <div className='item-content'>
              <h3>{record.projectName}{record.uploaded ? ' (uploaded)' : ''}</h3>
              <p>
              created {dateFromNow(record.createdAt)} by <span className='author'>{record.author || 'unknown'}</span>
              </p>
            </div>
            </Link>
          </div>
        )
      }) }
      {/* <button onClick={onAddStoryClicked} disabled={records.length >= config.maxStories}>Create Memory</button> */}
    </div>
  )
}

export { RecordListComponent }
