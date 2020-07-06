import React, { useEffect, useState } from "react";
import { getDatabase} from "../services/storage";
import { Link, useParams } from "react-router-dom";
import _ from 'lodash'
import { config } from "../config";
import { dateFromNow } from "../utils/utils";

import './styles/story.scss'
import './styles/input.scss'
import { RecordSchema, ProjectSchema, Store } from "../services/store";

const AuthorInputComponent = ({onCancel, onSave} : 
  { onCancel: () => void, onSave : (name: string) => void}) => {
  const [name, setName] = useState('')

  return(
    <div className='center-item'>
      <div className='input-element'>
        <input type='text' 
          placeholder='Enter your name' 
          value={name}
          onChange={(e) => setName(e.target.value)}/>
      </div>
      <div className='button-group'>
        <button onClick={() => onCancel()}>Cancel</button>
        <button onClick={() => onSave(name)} disabled={name.length < 2}>Save</button>
      </div>
    </div>
  )
}

const RecordListComponent = () => {
  const [records, setRecords] = useState<RecordSchema[]>([])
  const [project, setProject] = useState<ProjectSchema>({id: null, name: null, description: null, createdAt: null})
  const [createMode, enableCreateMode] = useState<boolean>(false)
  const { projectName } = useParams();

  useEffect(()=> {
    Store.getProject(projectName).then( projectData => { 
      setProject(projectData)
      return Store.getRecords()
    }).then( (storyData) => {
      setRecords(storyData)
    }).catch( err => {
      console.error(err)
      if (err instanceof Error) showModal('Error', err.message)
    })
  },[projectName])

  async function add(author: string) {
    try {
      const db = await getDatabase()
      const story = await db.writeStory({
        id: null,
        projectId: project.id,
        projectName: project.name,
        author: _.capitalize(author),
        createdAt: Date.now(),
        uploaded: false
      })
      const storiesData = await db.getStories()
      setRecords(storiesData)
    } catch (err) {
      console.error(err)
      if (err instanceof Error) showModal('Error', err.message)
    }
    enableCreateMode(false)
  }

  async function onAddStoryClicked() {
    enableCreateMode(true)
  }

  if (createMode) {
    return(
      <div className="story-list center">
        <AuthorInputComponent onCancel={() => enableCreateMode(false)} onSave={add}/>
      </div>
    )
  } else {
    return (
      _.isEmpty(records) ?
        <div className="story-list center">
          <div className='center-item'>
            <p>Record a new memory.</p>
            <button onClick={onAddStoryClicked}>Create Memory</button>
          </div>
        </div>
      : 
      <div className="story-list">
        <h2>Memories - {records.length}/{config.maxStories}</h2>
        { records.map( (story: RecordSchema, i) => {
          return( 
            <div key={i} className={story.uploaded? 'item uploaded': 'item'}>
              <Link to={`/${projectName}/records/${story.id}`}>
                <div className='item-content'>
                <h3>{story.projectName}{story.uploaded ? ' (uploaded)' : ''}</h3>
                <p>
                created {dateFromNow(story.createdAt)} by <span className='author'>{story.author || 'unknown'}</span>
                </p>
              </div>
              </Link>
            </div>
          )
        }) }
        <button onClick={onAddStoryClicked} disabled={records.length >= config.maxStories}>Create Memory</button>
      </div>
    )
  }
}

export { RecordListComponent }
