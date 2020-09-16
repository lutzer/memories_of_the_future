import React, { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import './styles/menubar.scss'

import ArrowBackImg from './../assets/arrow_back_black.png'
import RecordsImg from './../assets/records_black.png'
import AddRecordImg from './../assets/add_record_black.png'
import ProjectImg from './../assets/project_black.png'

type Properties = {
  projectName : string
}

const MenuBarComponent = ({projectName} : Properties) => {

  return(
    <div className='menubar'>
      <div className='menubuttons'>
        <Link className='button-with-icon' to={`/`}>
          <img src={ArrowBackImg}/>
          <span>Home</span>
        </Link>
        <Link className='button-with-icon' to={`/${projectName}/records`}>
          <img src={RecordsImg}/>
          <span>Drafts</span>
        </Link>
        <Link className='button-with-icon' to={`/${projectName}/add`}>
          <img src={AddRecordImg}/>
          <span>Add</span>
        </Link>
        <Link className='button-with-icon' to={`/${projectName}/info`}>
          <img src={ProjectImg}/>
          <span>Project</span>
        </Link>
      </div>
    </div>
  )
}

export { MenuBarComponent }