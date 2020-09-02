import React, { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import './styles/menubar.scss'

type Properties = {
  projectName : string
}

const MenuBarComponent = ({projectName} : Properties) => {

  return(
    <div className='menubar'>
      <div className='menubuttons'>
        <Link className='button' to={`/${projectName}/records`}>Drafts</Link>
        <Link className='button' to={`/${projectName}/add`}>Create</Link>
        <Link className='button' to={`/${projectName}/info`}>Project</Link>
      </div>
    </div>
  )
}

export { MenuBarComponent }