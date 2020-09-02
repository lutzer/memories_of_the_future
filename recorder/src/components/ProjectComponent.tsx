import React, { useState, useEffect } from "react";
import { useParams, Switch, Route, useRouteMatch, useHistory } from "react-router-dom";
import { ProjectSchema, StorySchema, Store, RecordSchema } from "../services/store";
import { HeaderComponent } from "./HeaderComponent";
import { RecordListComponent } from "./RecordListComponent";
import { RecordComponent } from "./RecordComponent";
import { UploadComponent } from "./UploadComponent";
import { MenuBarComponent } from "./MenuBarComponent";
import { SlideContainerComponent } from "./SlideContainterComponent";
import { AuthorInputComponent } from "./AuthorInputComponent";

import './styles/project.scss'
import './styles/input.scss'
import './styles/animations.scss'
import { ProjectInfoComponent } from "./ProjectInfoComponent";
import { DialogBoxComponent } from "./DialogBoxComponent";

type Props = {
  onStoriesChanged : (record : StorySchema[]) => void,
  selected : string
}

const ProjectComponent = ({selected, onStoriesChanged} : Props ) => {
  const [ project, setProject ] = useState<ProjectSchema>(null)
  const [ records, setRecords ] = useState<RecordSchema[]>([])

  const { projectName } = useParams();
  const history = useHistory();

  useEffect( () => {
    Store.getProject(projectName).then( data => {
      setProject(data)
    }).catch( err => {
      setProject(null)
      setRecords([])
    })
  }, [projectName])

  // load records
  useEffect( () => {
    Store.getRecords().then( data => {
      setRecords(data)
    }).catch( err => {
      setRecords([])
    })
  },[])

  async function addRecord(author: string) {
    try {
      const story = await Store.createRecord(author, project)
      history.push(`records/${story.id}`)
      setRecords([...records, story])
    } catch (err) {
      console.error(err)
      if (err instanceof Error) showModal('Error', err.message)
    }
  }

  async function deleteRecord(id: string) {
    try {
      await Store.deleteRecord(id)
      setRecords(await Store.getRecords())
      history.push(`./`)
    } catch (err) {
      console.error(err)
      if (err instanceof Error) showModal('Error', err.message)
    }
  }

  async function writeRecord(record : RecordSchema) {

  }
  
  return(
    <div className='main-container'>
      <HeaderComponent backButtonLink='/'/>
      { project ?
      <div>
        <MenuBarComponent projectName={projectName}/>
        <Switch>
          <Route path={`/${projectName}/records/:storyId`}>
            <SlideContainerComponent closePath={`/${projectName}/`}>
              <RecordComponent onDelete={ (id) => deleteRecord(id) }/>
            </SlideContainerComponent>
          </Route>
          <Route path={`/${projectName}/records`}>
            <SlideContainerComponent closePath={`/${projectName}/`}>
              <RecordListComponent project={project} records={records}/>
            </SlideContainerComponent>
          </Route>
          <Route path={`/${projectName}/add`}>
            <DialogBoxComponent >
              <AuthorInputComponent enabled={records.length < 5} onCancel={() => history.push(`/${projectName}/`)} onSave={(author) => addRecord(author)}/>
            </DialogBoxComponent>
          </Route>
          <Route path={`/${projectName}/info`}>
            <SlideContainerComponent fullscreen={false} closePath={`/${projectName}/`}>
              <ProjectInfoComponent project={project}/>
            </SlideContainerComponent>
          </Route>
          <Route path={`/${projectName}/upload/:storyId`}>
            <UploadComponent/>
          </Route>
        </Switch>
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