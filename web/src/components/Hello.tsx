import React from 'react'
import './styles/hello.scss'

export interface HelloProps { compiler: string; framework: string; }

export const Hello = (props: HelloProps) => {
  return(
    <h1 className="hello colour">Hello from {props.compiler} and {props.framework}!</h1>
  )
}