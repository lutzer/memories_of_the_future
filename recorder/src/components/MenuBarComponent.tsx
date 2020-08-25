import React, { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import './styles/menubar.scss'

type Properties = {
}

const MenuBarComponent = (props : Properties) => {
  const { path, url } = useRouteMatch();

  return(
    <div className='menubar'>
      <div className='menubuttons'>
        <Link className='button' to={`records`}>Records</Link>
        <Link className='button' to={`add`}>Add</Link>
        <Link className='button' to={`info`}>Project</Link>
      </div>
    </div>
  )
}

export { MenuBarComponent }