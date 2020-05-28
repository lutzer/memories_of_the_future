import React, { useState } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { StoryListComponent } from "./StoryListComponent";
import { StoryComponent } from "./StoryComponent";
import { ProjectViewComponent } from "./ProjectViewComponent";
import { ModalComponent, ModalProperties } from "./ModalComponent";
import { UploadComponent } from "./UploadComponent";
import { HeaderComponent } from "./HeaderComponent";

declare global {
  var showModal: (title: string, text: string) => void
}

const MainComponent = () => {
  const [modal, setModal] = useState<ModalProperties>(null)

  function showModal(title: string, text: string) {
    setModal({title: title, text: text, onAccept: () => setModal(null)})
  }

  function onBackButtonClick() {
    
  }

  window.showModal = showModal;

  return (
    <div className='content'>
    <Router>
      <Switch>
        <Route path="/story/:storyId">
          <HeaderComponent backButtonLink='/stories/'/>
          <div className='main'>
            <StoryComponent/>
          </div>
        </Route>
        <Route path="/upload/:storyId">
          <HeaderComponent backButtonLink='/stories/'/>
          <div className='main'>
            <UploadComponent/>
          </div>
        </Route>
        <Route path="/stories">
          <HeaderComponent backButtonLink='/'/>
          <div className='main'>
            <StoryListComponent/>
          </div>
        </Route>
        <Route path="/">
          <HeaderComponent/>
          <div className='main'>  
            <ProjectViewComponent/>
          </div>
        </Route>
      </Switch>
    </Router>
    { modal && <ModalComponent title={modal.title} text={modal.text} onAccept={modal.onAccept}/>}
    </div>
  )
}

export { MainComponent }
