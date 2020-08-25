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
import { MenuBarComponent } from "./MenuBarComponent";

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

  console.log(path)
  
  return(
    <div className='main-container'>
      <HeaderComponent backButtonLink='/'/>
      { project ?
      <div>
        <Switch>
          <Route path={`${path}records/:storyId`}>
            <RecordComponent/>
          </Route>
          <Route path={`${path}records`}>
            <RecordListComponent/>
          </Route>
          <Route path={`${path}upload/:storyId`}>
            <UploadComponent/>
          </Route>
        </Switch>
        <MenuBarComponent/>
      </div>
      :
      <div className='project center'>
        <div className='center-item fade-in'>
          <p>Could not load project data.</p>
        </div>
      </div>
      }
    </div>
  )
}

export { ProjectComponent }