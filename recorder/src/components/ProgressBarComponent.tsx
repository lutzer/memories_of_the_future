import React, { useState, useEffect } from "react";

import './styles/progress_bar.scss'

const ProgressBarComponent = ({progress, className = 'progress-bar', ...props} : 
{className?: string, progress : number}) => {

  return(
    <div className={className} {...props}>
      <div className='outer-line'>
        <div className='inner-line' style={{ width: progress * 100 + '%'}}>
        </div>
      </div>
    </div>
  )
}

export { ProgressBarComponent }
