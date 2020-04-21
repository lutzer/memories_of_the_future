import React, { Component } from "react";
import { MapComponent } from "./components/MapComponent";
import { ProjectsComponent } from "./components/ProjectsComponent";
import { OverlayComponent } from "./components/OverlayComponent";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/:projectName" component={ProjectsComponent} />

            <Route
              path="/"
              render={() => (
                <div>
                  <OverlayComponent />
                  <MapComponent />
                </div>
              )}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export { App };
