import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapComponent } from "./MapComponent";
import { ApiProjectSchema, Api, ApiStorySchema } from "../services/api";



const ProjectComponent = () => {
  const [ project, setProject ] = useState<ApiProjectSchema>(null)
  const [ stories, setStories ] = useState<ApiStorySchema[]>([])
  const { projectName } = useParams();

  useEffect( () => {
    Api.getProjectByName(projectName).then( data => {
      setProject(data.project)
    }).catch( err => {
      setProject(null)
      setStories([])
    })
  },[projectName])

  useEffect( () => {
    if (project)
      Api.getStoriesByProjectId(project.id).then( data => {
        setStories(data.stories)
      })
  },[project])
  
  return(
    <div>
      <h1>{projectName}</h1>
      <MapComponent stories={stories} onMarkerClick={(id) => alert('click id')}></MapComponent>
    </div>
  )
}

export { ProjectComponent }