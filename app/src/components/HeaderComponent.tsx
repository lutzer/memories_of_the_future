/// resolves svg import errors in vs code
/// <reference path="./../custom.d.ts" />

import React, { useEffect, useState } from "react";
import './styles/header.scss'

import logoImg from './../assets/logo_text.svg'

const HeaderComponent = ({ backButtonLink = null} : { backButtonLink? : string}) => {
  
  return (
    <div className='header'>
      <div className='logo'>
        <div className='outer'>
          <div className='inner'></div>
        </div>
        <img src={logoImg}/>
      </div>
      
    </div>
  )
}

export { HeaderComponent }