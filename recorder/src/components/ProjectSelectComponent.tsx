/// resolves svg import errors in vs code
/// <reference path="./../custom.d.ts" />

import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { ProjectSchema, Store } from "../services/store";

import ArrowForwardImg from "./../assets/arrow_right.svg"
import './styles/project.scss'
import './styles/input.scss'

const ERROR_TIMEOUT = 2000


const ProjectNameInputComponent = ({onAccept, showError} : 
  { onAccept : (name: string) => void, showError? : string } ) => {
    const [projectName, setProjectName] = useState('')

  function onKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    var code = event.keyCode || event.which;
    if(code === 13 && projectName.length >= 3) { //enter pressed
        onAccept(projectName)
    } 
  }

  return(
    <div>
      <div className='error'>
        { showError }
      </div>
      <div className='input-element bright'>
        <div className='input-text-with-button'>
          <input type='text' 
            placeholder='Enter project name' 
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyPress={onKeyPress}/>
          <button className='icon' onClick={() => onAccept(projectName)} disabled={projectName.length < 3}><img src={ArrowForwardImg}/></button>
        </div>
      </div>
    </div>
  )
}

const ProjectSelectComponent = () => {
  const [project, setProject] = useState<ProjectSchema>(null)
  const [error, setError] = useState<string>(null)
  const history = useHistory();

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
      setProject(project)
      history.push(`/${name}/`)
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

  return(
    <div className='main-container'>
      <div className='project-select'>
        <ProjectNameInputComponent onAccept={changeProject} showError={error}/>
        { project && <div className='project-select-last'>
          <Link to={`/${project.name}/`}>
            {project.name}
          </Link>
        </div> }
      </div>
    </div>
  )
}

export { ProjectSelectComponent }

 // <div className='project center'>
      //   <div className='details'>
      //     <Link to={`/${project.name}/`}>
      //       <div className='item-content'>
      //         <h3>{project.name}</h3>
      //         <p>{project.description}</p>
      //       </div>
      //     </Link>
      //   </div>
      //   <div className='change-button'>
      //     <button onClick={() => {}}>Change Project</button>
      //   </div>
      // </div>