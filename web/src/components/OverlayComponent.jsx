import React from "react";
import { Component } from "react";
//import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class OverlayComponent extends Component {
  constructor() {
    super();
    this.state = {
      projectName: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.setState({ projectName: event.target.value });
    console.log("heeey");
  }

  render() {
    return (
      <div id="formContainer">
        <label htmlFor="">Enter The Project Name</label>
        <input
          type="text"
          name="projectName"
          id="projectName"
          value={this.state.projectName}
          onChange={this.handleInputChange}
        />
        <Link to={'/'+this.state.projectName}>Submit</Link>
      </div>
    );
  }
}

export { OverlayComponent };
