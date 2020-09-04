import React, { useEffect, useState } from "react";
import './styles/project.scss'
import { ProjectSchema } from "../services/store";

type Properties = {
  project: ProjectSchema
}

const ProjectInfoComponent = ({ project } : Properties) => {
  
  return (
    <div className="project-info">
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <p>{project.description}</p>
    </div>
  )
}

export { ProjectInfoComponent }