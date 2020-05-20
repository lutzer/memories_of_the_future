import React, { useEffect, useState } from "react";
import { getDatabase, StorySchema, ProjectSchema } from "../services/storage";
import { Link, useHistory } from "react-router-dom";
import moment from 'moment';
import _ from 'lodash'
import { config } from "../config";

import './styles/story.scss'
import './styles/input.scss'

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

const StoryListComponent = () => {
  const [stories, setStories] = useState<StorySchema[]>([])
  const [project, setProject] = useState<ProjectSchema>({id: null, name: null, description: null})
  const [createMode, enableCreateMode] = useState<boolean>(false)

  useEffect(()=> {
    read()
  },[])

  async function read() {
    try {
      const db = await getDatabase()
      const storyData = await db.getStories()
      
      setStories(_.sortBy(storyData, ['createdAt']))
      const projectData = await db.getProject()
      setProject(projectData)
    } catch (err) {
      console.error(err)
    }
  }

  async function add(author: string) {
    try {
      const db = await getDatabase()
      const story = await db.writeStory({ 
        id: null, 
        projectId: project.id, 
        projectName: project.name, 
        author: _.capitalize(author),
        createdAt: Date.now() 
      })
      read()
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
      _.isEmpty(stories) ?
        <div className="story-list center">
          <div className='center-item'>
            <p>Record a new memory.</p>
            <button onClick={onAddStoryClicked}>Create Memory</button>
          </div>
        </div>
      : 
      <div className="story-list">
        <h2>Memories - {stories.length}/{config.maxStories}</h2>
        { stories.map( (story: StorySchema, i) => {
          return( 
            <div key={i} className='item'>
              <Link to={`/story/${story.id}`}>
                <div className='item-content'>
                <h3>{story.projectName}</h3>
                <p>
                created {moment(story.createdAt).fromNow()} by <span className='author'>{story.author || 'unknown'}</span>
                </p>
              </div>
              </Link>
            </div>
          )
        }) }
        <button onClick={onAddStoryClicked} disabled={stories.length >= config.maxStories}>Create Memory</button>
      </div>
    )
  }
}

export { StoryListComponent }
