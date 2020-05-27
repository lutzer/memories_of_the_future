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

const SpinnerComponent = ({start = true, completed = false, className = 'progress-bar', ...props} : 
{start? : boolean, completed? : boolean, className?: string}) => {
  const [progress, setProgress] = useState(0)

  useEffect( () => {
    const watchId = start && !completed ? setInterval( () => {
      setProgress(progress => progress + 2)
    },50) : null
    return function cleanup() {
      clearInterval(watchId)
    }
  }, [start, completed])

  return(
    <div className={className} {...props}>
      <div className='outer-line'>
        <div className='inner-line' style={{ width: completed ? 100 + '%' : (progress % 100) + '%'}}>
        </div>
      </div>
    </div>
  )
}

export { ProgressBarComponent, SpinnerComponent }
