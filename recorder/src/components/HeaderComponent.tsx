import React, { useEffect, useState } from "react";
import './styles/header.scss'
import { Link } from "react-router-dom";

const HeaderComponent = ({ backButtonLink = null} : { backButtonLink? : string}) => {
  
  return(
    <div className='header'>
      { backButtonLink && 
      <div className='left'>
        <Link className='backbutton' to={backButtonLink}>&#60;</Link>
      </div>
      }
      <div className='title'><h1>Memories of the Future</h1></div>
    </div>
  )
}

export { HeaderComponent }