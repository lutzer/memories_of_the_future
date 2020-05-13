import React, { useEffect, useState } from "react";
import { getDatabase, StorySchema } from "../storage/database";

const StoryComponent = () => {
  const [stories, setStories] = useState([])

  useEffect(()=> {
    read()
  },[])

  async function read() {
    try {
      const db = await getDatabase()
      const vals = await db.getAll()
      setStories(vals)
    } catch (err) {
      console.error(err)
    }
  }

  async function add() {
    try {
      const db = await getDatabase()
      await db.write({ id: Math.round(Math.random()*1000), author: 'peter' })
      await read()
    } catch (err) {
      console.error(err)
    }
  }

  async function remove(id : number) {
    try {
      const db = await getDatabase()
      await db.remove(id)
      await read()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <ul>
        { stories.map( (story: StorySchema, i) => {
          return( 
            <li key={i}>
              <p>{story.id}</p>
              <button onClick={() => remove(story.id)}>Delete Story</button>
            </li>
          )
        })}
      </ul> 
      <button onClick={add}>Add Story</button>
    </div>
  )
}

export { StoryComponent }
