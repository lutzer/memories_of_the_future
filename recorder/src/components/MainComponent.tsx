import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { StoryListComponent } from "./StoryListComponent";
import { StoryComponent } from "./StoryComponent";

const MainComponent = () => {
  return (
    <Router>
      <Switch><Route path="/story/:storyId">
        <div>
          <h1>Memories of the Future</h1>
          <StoryComponent/>
        </div>
        </Route>
        <Route path="/">
        <div>
          <h1>Memories of the Future</h1>
          <StoryListComponent/>
        </div>
        </Route>
      </Switch>
    </Router>
  )
}

export { MainComponent }
