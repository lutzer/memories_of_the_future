import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { StoryListComponent } from "./StoryListComponent";
import { StoryComponent } from "./StoryComponent";
import { LocationPickerComponent } from "./LocationPickerComponent";

const MainComponent = () => {
  return (
    <div>
      <h1>Memories of the Future</h1>
    <Router>
      <Switch>
        <Route path="/story/:storyId">
          <StoryComponent/>
        </Route>
        <Route path="/">
          <StoryListComponent/>
        </Route>
      </Switch>
    </Router>
    </div>
  )
}

export { MainComponent }
