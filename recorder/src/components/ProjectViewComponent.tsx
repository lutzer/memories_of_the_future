import React, { useEffect, useState } from "react";
import { getDatabase, ProjectSchema } from "../services/database";
import { Link } from "react-router-dom";
import './styles/project.scss'
import './styles/modal.scss'
import { Api, ApiNoDataError } from "../services/api";

const ProjectAddDialog = ({onAccept, onCancel} : {
  onAccept : ({name, password} : {name: string, password: string}) => void, 
  onCancel : () => void
}) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [okDisabled, setOkDisabled] =useState(true)

  useEffect( () => {
    setOkDisabled(name.length < 3 || password.length < 3)
  },[name, password])

  function onOkClicked() {
    const data = {
      name : name,
      password: password
    }
    onAccept(data);
  }
  
  return(
    <div className='modal'>
      <div className='dialog'>
        <h3>Change Project</h3>
        <div className='input-element'>
          <input type='text' placeholder='Name' onChange={e => setName(e.target.value)}/>
        </div>
        <div className='input-element'>
          <input type='password' placeholder='Password' onChange={e => setPassword(e.target.value)}/>
        </div>
        <button onClick={onCancel}>Cancel</button>
        <button disabled={okDisabled} onClick={onOkClicked}>Ok</button>
      </div>
    </div>
  )
}

const ProjectViewComponent = () => {
  const [project, setProject] = useState<ProjectSchema>(null)
  const [addDialogVisible, showAddDialog] = useState(false)

  useEffect(()=> {
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

  async function changeProject(name: string, password: string) {
    try {
      const data = await Api.getProjectByName(name)
      const db = await getDatabase()
      await db.setProject({id : data.project.id, name: data.project.name, password: password})
      showAddDialog(false)
      readProject()
    } catch (err) {
      if (err instanceof ApiNoDataError)
        alert('no data')
      else
        console.error(err)
    }
  }

  return (
    <div className="project">
      { addDialogVisible && <ProjectAddDialog 
        onCancel={() => showAddDialog(false)}
        onAccept={(data) => changeProject(data.name, data.password)}/> }
      <h2>Project</h2>
      { project &&
          <div className='details'>
            <p>Id: {project.id}</p>
            <p>Name: {project.name}</p>
          </div>
      }
      <button onClick={() =>  showAddDialog(true)}>Change Project</button>
    </div>
  )
}

export { ProjectViewComponent }
