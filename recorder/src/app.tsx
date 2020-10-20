import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { MainComponent } from './components/MainComponent'

declare global {
  var showModal: (title: string, text: string, cancelable? : boolean) => Promise<boolean>
}

ReactDOM.render(
  <MainComponent/>, 
  document.getElementById("app") 
);