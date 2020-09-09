import React, { useEffect, useState } from "react";
import { getDatabase } from "../services/storage";
import { Link } from "react-router-dom";
import { Api, ApiException } from "../services/api";
import { EvalSourceMapDevToolPlugin } from "webpack";
import { ProjectSchema, Store } from "../services/store";

import './styles/project.scss'
import './styles/input.scss'

const ERROR_TIMEOUT = 2000


const ProjectNameInputComponent = ({onCancel, onSave, showError} : 
  { onCancel: () => void, onSave : (name: string) => void, showError? : string }) => {
    const [projectName, setProjectName] = useState('')

  return(
    <div className='project center'>
      <div className='center-item'>
        <div className='error'>
          { showError }
        </div>
        <div className='input-element'>
          <input type='text' 
            placeholder='Enter project name' 
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}/>
        </div>
        <div className='button-group'>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={() => onSave(projectName)}>Ok</button>
        </div>
      </div>
    </div>
  )
}

const ProjectSelectComponent = () => {
  const [project, setProject] = useState<ProjectSchema>(null)
  const [editing, setEditing] = useState<boolean>(false)
  const [error, setError] = useState<string>(null)

  useEffect(() => {
    Store.getCurrentProject().then( (data) => {
      setProject(data)
    }).catch( err => {
      console.log(err)
    })
  },[])

  async function changeProject(name: string) {
    try {
      const project = await Store.setCurrentProject(name)
      setEditing(false)
      setProject(project)
    } catch (err) {
      if (err instanceof Error)
        showError(err.message)
    }
  }

  function showError(text : string) {
    setError(text)
    setTimeout(() => {
      setError(null)
    },2000)
  }

  if (!editing) {
    return(
      <div className='main-container'>
        { project ?
        <div className='project center'>
          <div className='details'>
            <Link to={`/${project.name}/`}>
              <div className='item-content'>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>
            </Link>
          </div>
          <div className='change-button'>
            <button onClick={() => setEditing(true)}>Change Project</button>
          </div>
        </div>
        :
        <div className='project center'>
          <div className='center-item'>
            <p>No project selected</p>
            <button onClick={() => setEditing(true)}>Choose Project</button>
          </div>
        </div> }
      </div>
    )
  } else {
    return(
      <div className='main-container'>
        <ProjectNameInputComponent onCancel={() => setEditing(false)} onSave={changeProject} showError={error}/>
      </div>
    )
  }
}

export { ProjectSelectComponent }