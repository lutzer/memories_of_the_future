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
  // return(
  //   <div className='header'>
  //     { backButtonLink && 
  //     <div className='left'>
  //       <Link className='backbutton' to={backButtonLink}>&#60;</Link>
  //     </div>
  //     }
  //     <div className='title'><h1>Memories of the Future</h1></div>
  //   </div>
  // )
}

export { HeaderComponent }