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

const SpinnerComponent = ({spinning = true, completed = false, className = 'progress-bar', ...props} : 
{spinning? : boolean, completed? : boolean, className?: string}) => {
  const [value, setValue] = useState(0)

  useEffect( () => {
    var watchId : NodeJS.Timeout = null
    // if (progress && !completed)  {
    //   watchId = setInterval( () => {
    //     setProgress(progress => progress + 2)
    //   },50)
    // }
    if (completed)
      setValue(100)
    else if (!spinning)
      setValue(0)
    else {
      watchId = setInterval( () => {
        setValue(value => (value + 2) % 100)
      },50)
    }
    return function cleanup() {
      clearInterval(watchId)
    }
  }, [spinning, completed])

  return(
    <div className={className} {...props}>
      <div className='outer-line'>
        <div className='inner-line' style={{ width: value + '%'}}>
        </div>
      </div>
    </div>
  )
}

export { ProgressBarComponent, SpinnerComponent }
