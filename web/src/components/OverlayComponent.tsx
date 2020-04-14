import React from "react";
import { Component } from "react";
//import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class OverlayComponent extends Component {
  state = {
    projectName: "",
  };
  componentWillMount() {}
  render() {
    return (
      <div id="formContainer">
        <form>
          <label htmlFor="">Enter The Project Name</label>
          <input
            type="text"
            name="projectName"
            id="projectName"
            value={this.state.projectName}
          />
          <Link to="/api/projects">Submit</Link>
        </form>
      </div>
    );
  }
}

export { OverlayComponent };
