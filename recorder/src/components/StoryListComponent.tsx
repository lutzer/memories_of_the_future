import React, { useEffect, useState } from "react";
import { getDatabase, StorySchema } from "../services/database";
import { Link, useParams } from "react-router-dom";
import moment from 'moment';
import './styles/story.scss'

const StoryListComponent = () => {
  const [stories, setStories] = useState([])
  const { projectId } = useParams();

  useEffect(()=> {
    readStories()
  },[projectId])

  async function readStories() {
    try {
      const db = await getDatabase()
      const data = await db.getStories()
      setStories(data.filter( (story) => story.projectId == projectId))
    } catch (err) {
      console.error(err)
    }
  }

  async function onAddStoryClicked() {
    try {
      const db = await getDatabase()
      await db.writeStory({ id: null, projectId: projectId, createdAt: Date.now() })
      await readStories()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="story-list">
      <h2>Stories</h2>
      { stories.map( (story: StorySchema, i) => {
        return( 
          <div key={i} className='item'>
            <p>Id: {story.id}</p>
            <p>Author: {story.author || 'none'}</p>
            <p>Created: {moment(story.createdAt).fromNow()}</p>
            <p><Link to={`/story/${story.id}`}>Link</Link></p>
          </div>
        )
      })}
      <button onClick={onAddStoryClicked}>Create Story</button>
    </div>
  )
}

export { StoryListComponent }
