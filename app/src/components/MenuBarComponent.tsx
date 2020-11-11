/// resolves svg import errors in vs code
/// <reference path="./../custom.d.ts" />

import React, { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import './styles/menubar.scss'

import ArrowBackImg from './../assets/arrow_left.svg'
import DraftImg from './../assets/drafts.svg'
import AddRecordImg from './../assets/add.svg'
import MemoriesImg from './../assets/memories.svg'

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
          <img src={DraftImg}/>
          <span>Drafts</span>
        </Link>
        <Link className='button-with-icon' to={`/${projectName}/add`}>
          <img src={AddRecordImg}/>
          <span>Add</span>
        </Link>
        <Link className='button-with-icon' to={`/${projectName}/info`}>
          <img src={MemoriesImg}/>
          <span>Memories</span>
        </Link>
      </div>
    </div>
  )
}

export { MenuBarComponent }