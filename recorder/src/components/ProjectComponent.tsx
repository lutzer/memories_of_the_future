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
import _ from "lodash";
import { StoryComponent } from "./StoryComponent";

function handleDbError(err : any) {
  console.log(err)
  if (err instanceof Error) showModal('Error', err.message)
}

type Props = {
  onStoriesChanged : (record : StorySchema[]) => void,
  onStorySelected : (id: string) => void,
  selected : string
}

const ProjectComponent = ({selected, onStorySelected, onStoriesChanged} : Props ) => {
  const [ project, setProject ] = useState<ProjectSchema>(null)
  const [ records, setRecords ] = useState<RecordSchema[]>([])
  const [ stories, setStories ] = useState<StorySchema[]>([])

  const { projectName } = useParams();
  const history = useHistory();

  // load project
  useEffect( () => {
    Store.getProject(projectName).then( data => {
      setProject(data)
    }).catch( err => {
      setProject(null)
    })
  }, [projectName])

  //load stories
  useEffect( () => {
    if (project)
      Store.getStories(project.id).then( data => {
        setStories(data)
      }).catch( err => {
        setStories([])
      })
    else
      setStories([])
  }, [project])

  // load records
  useEffect( () => {
    Store.getRecords().then( data => {
      setRecords(data)
    }).catch( err => {
      setRecords([])
    })
  },[])

  // on story changed callback
  useEffect( () => {
    onStoriesChanged(stories)
  }, [stories])

  async function addRecord(author: string) {
    try {
      const record = await Store.createRecord(author, project)
      setRecords([...records, record])
      history.push(`records/${record.id}`)
    } catch (err) {
      handleDbError(err)
    }
  }

  async function deleteRecord(id: string) {
    try {
      await Store.deleteRecord(id)
      setRecords(_.filter(records, (data) => {
        return data.id != id
      }))
      history.push(`./`)
    } catch (err) {
      handleDbError(err)
    }
  }

  async function updateRecord(record : RecordSchema) {
    try {
      await Store.updateRecord(record)
      setRecords(_.map(records, (data) => {
        return data.id == record.id ? record : data
      }))
    } catch (err) {
      handleDbError(err)
    }
  }

  async function onRecordUploaded(record : RecordSchema, serverId : string) {
    try {
      record.uploaded = true
      await Store.updateRecord(record)
      await Store.moveRecord(record.id, serverId)
      setRecords(await Store.getRecords())
      history.push(`/${projectName}/records/${serverId}`)
    } catch (err) {
      handleDbError(err)
    }
  }
  
  return(
    <div className='main-container'>
      <HeaderComponent backButtonLink='/'/>
      { project ?
      <div>
        <MenuBarComponent projectName={projectName}/>
        <Switch>
          <Route path={`/${projectName}/records/:storyId`}  render={({match}) => {
            return(
              <SlideContainerComponent closePath={`/${projectName}/`}>
                <RecordComponent record={_.find(records,{id : match.params.storyId})} onDelete={(id) => deleteRecord(id)} onChange={(record) => updateRecord(record)}/>
              </SlideContainerComponent>
            )
          }}/>
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
              <ProjectInfoComponent project={project} stories={stories}/>
            </SlideContainerComponent>
          </Route>
          <Route path={`/${projectName}/upload/:storyId`} render={({match}) => {
            return(
              <DialogBoxComponent>
                <UploadComponent record={_.find(records,{id : match.params.storyId})} onUploadSuccess={onRecordUploaded} onCancelled={() => history.push(`/${projectName}/records`)}/>
              </DialogBoxComponent>
            )
          }}/>
          <Route path={`/${projectName}/stories/:storyId`} render={({match}) => {
            return(
              <SlideContainerComponent fullscreen={false} closePath={`/${projectName}/`}>
                <StoryComponent story={_.find(stories,{id : match.params.storyId})} setSelected={onStorySelected}/>
              </SlideContainerComponent>
            )
          }}/>
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