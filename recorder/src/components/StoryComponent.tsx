import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, StorySchema } from "../storage/database";
import './styles/story.scss'
import { RecorderComponent } from "./RecorderComponent";
import { AudioRecording } from "../media/recorder";
import { AudioPlayerComponent } from "./AudioPlayerComponent";

const StoryComponent = () => {
  const [story, setStory] = useState<StorySchema>(null)
  const { storyId } = useParams();

  useEffect(()=> {
    console.log(storyId)
    read()
  },[])

  async function read() {
    try {
      const db = await getDatabase()
      const val = await db.getStory(storyId)
      setStory(val)
    } catch (err) {
      console.error(err)
    }
  }

  async function saveRecording(recording: AudioRecording) {
    try {
      const db = await getDatabase()
      const data : StorySchema = Object.assign({}, story, { recording: recording.blob})
      db.writeStory(data)
      setStory(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteRecording() {
    try {
      const db = await getDatabase()
      const data : StorySchema = Object.assign({}, story, { recording: null})
      db.writeStory(data)
      setStory(data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      { story &&
        <div className='story'>
          <p>{story.id}</p>
          <p>{story.author}</p>
          <p>{story.createdAt}</p>
          { story.recording ?
            <div>
               <AudioPlayerComponent audioData={story.recording}/>
               <button onClick={deleteRecording}>Delete Recording</button>
            </div>
           : <RecorderComponent onSave={(rec) => saveRecording(rec)}/> }
        </div>
      }
    </div>
  )
}

export { StoryComponent }
