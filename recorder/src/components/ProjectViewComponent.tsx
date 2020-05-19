import React, { useEffect, useState } from "react";
import { getDatabase, ProjectSchema } from "../services/storage";
import { Link } from "react-router-dom";
import { Api, ApiException } from "../services/api";
import { EvalSourceMapDevToolPlugin } from "webpack";

import './styles/project.scss'
import './styles/input.scss'

const ERROR_TIMEOUT = 2000

const ProjectViewComponent = () => {
  const [project, setProject] = useState<ProjectSchema>(null)
  const [editing, setEditing] = useState<boolean>(false)
  const [projectName, setProjectName] = useState('')
  const [error, setError] = useState<string>(null)

  useEffect(() => {
    readProject()
  },[])


  async function readProject() {
    try {
      const db = await getDatabase()
      const data = await db.getProject()
      setProject(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function changeProject(name: string) {
    try {
      const data = await Api.getProjectByName(name)
      const db = await getDatabase()
      await db.setProject(data.project)
      setEditing(false)
    } catch (err) {
      console.error(err)
      if (err instanceof Error)
        showError(err.message)
    }
    readProject()
  }

  function showError(text : string) {
    setError(text)
    setTimeout(() => {
      setError(null)
    },2000)
  }

  if (!editing) {
    return(
      <div className='project'>
        { project ? 
          <div className='details'>
            <Link to='/stories'>
              <div className='item-content'>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>
            </Link>
            <button onClick={() => setEditing(true)}>Change Project</button>
          </div>
        :
        <div className='placeholder'>
          <p>No project selected</p>
          <button onClick={() => setEditing(true)}>Choose Project</button>
        </div>
        }
      </div>
    )
  } else {
    return(
      <div className='project center'>
        <div className='placeholder'>
          <div className='error'>
            { error }
          </div>
          <div className='input-element'>
            <input type='text' 
              placeholder='Project Name' 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}/>
          </div>
          <div className='button-group'>
            <button onClick={() => setEditing(false)}>Cancel</button>
            <button onClick={() => changeProject(projectName)}>Save</button>
          </div>
        </div>
      </div>
    )
  }
}

export { ProjectViewComponent }
