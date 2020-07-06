import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapComponent } from "./MapComponent";
import { ProjectSchema, StorySchema, Store } from "../services/store";

import './styles/project.scss'
import './styles/input.scss'
import './styles/animations.scss'

const ProjectComponent = () => {
  const [ project, setProject ] = useState<ProjectSchema>(null)
  const [ stories, setStories ] = useState<StorySchema[]>([])
  const { projectName } = useParams();

  useEffect( () => {
    Store.getProject(projectName).then( data => {
      setProject(data)
    }).catch( err => {
      setProject(null)
      setStories([])
    })
  }, [projectName])

  useEffect( () => {
    if (project)
      Store.getStories(project.id).then( data => {
        setStories(data)
      }).catch( err => {
        console.warn('Could not load stories from api.')
      })
  },[project])
  
  return(
    project ? 
      <div>
        <h1>{projectName}</h1>
        <Link className='button' to={`/${projectName}/records/`}>Records</Link>
        <MapComponent stories={stories} onMarkerClick={(id) => alert('click id')}></MapComponent>
      </div>
    :
    <div className='project center'>
        <div className='center-item fade-in'>
          <p>Could not load project data</p>
        </div>
      </div>
  )
}

export { ProjectComponent }