import React, { useState } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { RecordListComponent } from "./RecordListComponent";
import { RecordComponent } from "./RecordComponent";
import { ProjectSelectComponent } from "./ProjectSelectComponent";
import { ModalComponent, ModalProperties } from "./ModalComponent";
import { UploadComponent } from "./UploadComponent";
import { HeaderComponent } from "./HeaderComponent";
import { ProjectComponent } from "./ProjectComponent";

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
          onCancel: () => { setModal(null); resolve(false) }
        })
      else
        setModal({title: title, text: text, onAccept: () => { setModal(null); resolve(true) }})
    })
  }

  function onBackButtonClick() {
    
  }

  window.showModal = showModal;

  return (
    <div className='content'>
    <Router>
      <Switch>
        
        <Route path="/:projectName/records/:storyId">
          <HeaderComponent backButtonLink='.'/>
          <div className='main'>
            <RecordComponent/>
          </div>
        </Route>
        <Route path="/:projectName/records">
          <HeaderComponent backButtonLink='../'/>
          <div className='main'>
            <RecordListComponent/>
          </div>
        </Route>
        <Route path="/:projectName/upload/:storyId">
          <HeaderComponent backButtonLink='../records/'/>
          <div className='main'>
            <UploadComponent/>
          </div>
        </Route>
        <Route path='/:projectName'>
          <HeaderComponent backButtonLink='/'/>
          <ProjectComponent/>
        </Route>
        <Route path="/">
          <HeaderComponent/>
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
