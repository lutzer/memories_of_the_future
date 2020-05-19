import React, { useEffect, useState } from "react";
import { getDatabase, StorySchema, ProjectSchema } from "../services/storage";
import { Link, useHistory } from "react-router-dom";
import moment from 'moment';
import _ from 'lodash'
import './styles/story.scss'

const StoryListComponent = () => {
  const [stories, setStories] = useState<StorySchema[]>([])
  const [project, setProject] = useState<ProjectSchema>({id: null, name: null, description: null})
  const history = useHistory();

  useEffect(()=> {
    read()
  },[])

  async function read() {
    try {
      const db = await getDatabase()
      const storyData = await db.getStories()
      setStories(storyData)
      const projectData = await db.getProject()
      setProject(projectData)
    } catch (err) {
      console.error(err)
    }
  }

  async function onAddStoryClicked() {
    try {
      const db = await getDatabase()
      const story = await db.writeStory({ 
        id: null, 
        projectId: project.id, 
        projectName: project.name, 
        createdAt: Date.now() 
      })
      read()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    _.isEmpty(stories) ?
      <div className="story-list center">
        <div className='placeholder'>
          <p>Record a new memory</p>
          <button onClick={onAddStoryClicked}>Create Memory</button>
        </div>
      </div>
    : 
    <div className="story-list">
      { stories.map( (story: StorySchema, i) => {
        return( 
          <div className='item'>
            <Link key={i} to={`/story/${story.id}`}>
              <div className='item-content'>
              <h3>{story.projectName}</h3>
              <p>
              created {moment(story.createdAt).fromNow()} from <span className='author'>{story.author || 'unknown'}</span>
              </p>
            </div>
            </Link>
          </div>
        )
      }) }
      <button onClick={onAddStoryClicked}>Create Memory</button>
    </div>
  )
}

export { StoryListComponent }
