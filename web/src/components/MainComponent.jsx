import React from "react";
import { MapComponent } from "./MapComponent";
import { OverlayComponent } from "./OverlayComponent";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

const MainComponent = () => {
  return (
    <Router>
      <Switch>
        <Route path="/:projectName">
          <div>Test</div>
        </Route>
        <Route path="/">
          <div>
            <OverlayComponent />
            <MapComponent />
          </div>
        </Route>
      </Switch>
    </Router>
  );
};

export { MainComponent };
