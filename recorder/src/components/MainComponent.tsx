import React, { useState } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { StoryListComponent } from "./StoryListComponent";
import { StoryComponent } from "./StoryComponent";
import { ProjectViewComponent } from "./ProjectViewComponent";
import { ModalComponent, ModalProperties } from "./ModalComponent";
import { UploadComponent } from "./UploadComponent";
import { HeaderComponent } from "./HeaderComponent";

declare global {
  var showModal: (title: string, text: string, cancelable? : boolean) => Promise<boolean>
}

const MainComponent = () => {
  const [modal, setModal] = useState<ModalProperties>(null)

  function showModal(title: string, text: string, cancelable : boolean = false) : Promise<boolean> {
    return new Promise( (resolve) => {
      if (cancelable)
        setModal({title: title, text: text,
          onAccept: () => { setModal(null); resolve(true) },
          onCancel: () => { setModal(null); resolve(false)}
        })
      else
        setModal({title: title, text: text, onAccept: () => { setModal(null); resolve(true) }})
    })
    // if (callback)
    //   setModal({
    //     title: title, 
    //     text: text, 
    //     onAccept: () => { callback(true); setModal(null) }, 
    //     onCancel: () => { callback(false); setModal(null) } 
    //   })
    // else
      
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
