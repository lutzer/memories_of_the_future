import React, { useState } from "react";
import { HashRouter as Router, Switch, Route, useParams } from "react-router-dom";
import { ProjectSelectComponent } from "./ProjectSelectComponent";
import { ModalComponent, ModalProperties } from "./ModalComponent";
import { HeaderComponent } from "./HeaderComponent";
import { ProjectComponent } from "./ProjectComponent";

import './styles/main.scss'
import { MapComponent } from "./MapComponent";
import { StorySchema } from "../services/store";

declare global {
  var showModal: (title: string, text: string, cancelable? : boolean) => Promise<boolean>
}

const MainComponent = () => {
  const [modal, setModal] = useState<ModalProperties>(null)
  const [ stories, setStories ] = useState<StorySchema[]>([])

  function showModal(title: string, text: string, cancelable : boolean = false) : Promise<boolean> {
    return new Promise( (resolve) => {
      if (cancelable)
        setModal({title: title, text: text,
          onAccept: () => { setModal(null); resolve(true) },
          onCancel: () => { setModal(null); resolve(false) }
        })
      else
        setModal({title: title, text: text, onAccept: () => { setModal(null); resolve(true) }})
    })
  }

  window.showModal = showModal;

  return (
    <div className='content'>
      <MapComponent stories={stories} onMarkerClick={(id) => alert('click id')} showCenterButton={false}/>
      <Router>
        <Switch>
          <Route path='/:projectName'>
            <ProjectComponent onStoriesChanged={setStories}/>
          </Route>
          <Route path="/">
            <div className='main'>  
              <ProjectSelectComponent/>
            </div>
          </Route>
        </Switch>
      </Router>
      { modal && <ModalComponent title={modal.title} text={modal.text} onAccept={modal.onAccept}/>}
    </div>
  )
}

export { MainComponent }
