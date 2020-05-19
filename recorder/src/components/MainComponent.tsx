import React, { useState } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { StoryListComponent } from "./StoryListComponent";
import { StoryComponent } from "./StoryComponent";
import { ProjectViewComponent } from "./ProjectViewComponent";
import { ModalComponent, ModalProperties } from "./ModalComponent";

declare global {
  var showModal: (title: string, text: string) => void
}

const MainComponent = () => {
  const [modal, setModal] = useState<ModalProperties>(null)

  function showModal(title: string, text: string) {
    setModal({title: title, text: 'text', onAccept: () => setModal(null)})
  }

  window.showModal = showModal;

  return (
    <div className='content'>
      <div className='header'>
        <h1>Memories of the Future</h1>
      </div>
      <div className='main'>
      <Router>
        <Switch>
          <Route path="/story/:storyId">
            <StoryComponent/>
          </Route>
          <Route path="/stories">
            <StoryListComponent/>
          </Route>
          <Route path="/">
            <ProjectViewComponent/>
          </Route>
        </Switch>
      </Router>
      </div>
    { modal && <ModalComponent title={modal.title} text={modal.text} onAccept={modal.onAccept}/>}
    </div>
  )
}

export { MainComponent }
