import React, { useEffect, useState } from "react";
import { getDatabase, StorySchema } from "../storage/database";
import { Link } from "react-router-dom";
import moment from 'moment';
import './styles/story.scss'

const StoryListComponent = () => {
  const [stories, setStories] = useState([])

  useEffect(()=> {
    read()
  },[])

  async function read() {
    try {
      const db = await getDatabase()
      const vals = await db.getStories()
      setStories(vals)
    } catch (err) {
      console.error(err)
    }
  }

  async function add() {
    try {
      const db = await getDatabase()
      await db.writeStory({ id: null, author: 'peter', createdAt: Date.now() })
      await read()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      { stories.map( (story: StorySchema, i) => {
        return( 
          
          <div key={i} className='story list-item'>
            <p>{story.id}</p>
            <p>{story.author}</p>
            <p>{moment(story.createdAt).fromNow()}</p>
            <p><Link to={`story/${story.id}`}>Link</Link></p>
          </div>
        )
      })}
      <button onClick={add}>Create Story</button>
    </div>
  )
}

export { StoryListComponent }
