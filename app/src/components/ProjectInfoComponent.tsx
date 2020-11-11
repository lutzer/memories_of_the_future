import React from "react";
import './styles/project.scss'
import { ProjectSchema, StorySchema } from "../services/store";
import { Link } from "react-router-dom";
import _ from "lodash";
import { dateFromNow } from "../utils/utils";

type Properties = {
  project: ProjectSchema,
  stories : StorySchema[]
}


const ProjectInfoComponent = ({ project, stories } : Properties) => {
  
  return (
    <div className="project-info">
      <div>
      <h2 className='slideheader'>{project.name}</h2>
        <p>{project.description}</p>
      </div>
      <div>
        <h2>Memories</h2>
        <StoryListComponent project={project} stories={stories}/>
      </div>
    </div>
  )
}


const StoryListComponent = ( {project, stories} : { project: ProjectSchema, stories : StorySchema[] } ) => {

  return (
    <div className='story-list'>
      { !_.isEmpty(stories) ?
        <ul>
          { stories.map((story, index) => {
            return (
            <Link key={index} to={`/${project.name}/stories/${story.id}`}>
              <li>
                <h4>{story.title}</h4>
                <div className='date'>{dateFromNow(story.createdAt)}</div>
              </li>
            </Link>
            )
          })
          }
        </ul>
      :
        <div className='empty'>No memories recorded yet.</div>
      }
    </div>
  )
}

export { ProjectInfoComponent }