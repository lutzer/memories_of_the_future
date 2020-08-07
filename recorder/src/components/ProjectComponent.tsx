import React, { useState, useEffect } from "react";
import { useParams, Link, Switch, Route, useRouteMatch } from "react-router-dom";
import { ProjectSchema, StorySchema, Store } from "../services/store";

import './styles/project.scss'
import './styles/input.scss'
import './styles/animations.scss'
import { HeaderComponent } from "./HeaderComponent";
import { RecordListComponent } from "./RecordListComponent";
import { RecordComponent } from "./RecordComponent";
import { UploadComponent } from "./UploadComponent";

type Props = {
  onStoriesChanged : (stories : StorySchema[]) => void
}

const ProjectComponent = ({onStoriesChanged} : Props ) => {
  const [ project, setProject ] = useState<ProjectSchema>(null)
  const [ stories, setStories ] = useState<StorySchema[]>([])

  const { projectName } = useParams();
  const { path, url } = useRouteMatch();

  function setStoryData(stories : StorySchema[]) {
    setStories(stories)
    onStoriesChanged(stories)
  }

  useEffect( () => {
    Store.getProject(projectName).then( data => {
      setProject(data)
    }).catch( err => {
      setProject(null)
      setStoryData([])
    })
  }, [projectName])

  useEffect( () => {
    if (project)
      Store.getStories(project.id).then( data => {
        setStoryData(data)
      }).catch( err => {
        console.warn('Could not load stories from api.')
      })
  },[project])
  
  return(
    <div>
      <Switch>
        <Route exact path={path}>
          { project ? 
            <div className='main'>
              <h1>{projectName}</h1>
              <Link className='button' to={`/${projectName}/records/`}>Records</Link>
            </div>
          :
          <div className='project center'>
              <div className='center-item fade-in'>
                <p>Could not load project data</p>
              </div>
            </div>
          }
        </Route>
        <Route path={`${path}/records/:storyId`}>
            <HeaderComponent backButtonLink='.'/>
            <RecordComponent/>
          </Route>
        <Route path={`${path}/records/`}>
          <HeaderComponent backButtonLink='../'/>
          <RecordListComponent/>
        </Route>
        <Route path={`${path}/upload/:storyId`}>
            <HeaderComponent backButtonLink='../records/'/>
            <UploadComponent/>
          </Route>
      </Switch>
    </div>
  )
}

export { ProjectComponent }