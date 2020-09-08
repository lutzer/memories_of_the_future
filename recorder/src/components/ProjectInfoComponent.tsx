import React, { useEffect, useState } from "react";
import './styles/project.scss'
import { ProjectSchema, StorySchema } from "../services/store";
import { Link } from "react-router-dom";

type Properties = {
  project: ProjectSchema,
  stories : StorySchema[]
}


const ProjectInfoComponent = ({ project, stories } : Properties) => {
  
  return (
    <div className="project-info">
      <div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
      </div>
      <div>
        <h3>Memories</h3>
        <StoryListComponent project={project} stories={stories}/>
      </div>
    </div>
  )
}


const StoryListComponent = ( {project, stories} : { project: ProjectSchema, stories : StorySchema[] } ) => {
  return (
    <div className='story-list'>
      <ul>
        { stories.map((story, index) => {
          return (
          <Link key={index} to={`/${project.name}/stories/${story.id}`}>
            <li>
              <h4>{story.title}</h4>
            </li>
          </Link>
          )
        })
        }
      </ul>
    </div>
  )
}

export { ProjectInfoComponent }