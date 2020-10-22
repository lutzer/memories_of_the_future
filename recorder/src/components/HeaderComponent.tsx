import React, { useEffect, useState } from "react";
import './styles/header.scss'

import logoImg from './../assets/logo.png'

const HeaderComponent = ({ backButtonLink = null} : { backButtonLink? : string}) => {
  
  return (
    <div className='header'>
      <div className='logo'>
        <div className='outer'></div>
        <div className='inner'></div>
        <img src={logoImg}/>
      </div>
      
    </div>
  )
}

export { HeaderComponent }