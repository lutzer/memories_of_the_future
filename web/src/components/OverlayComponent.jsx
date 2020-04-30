import React from "react";
import { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Button } from 'semantic-ui-react'


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
  }

  render() {
    return (
      <div id="formContainer">
        <label className="prName" htmlFor="">Enter The Project Name</label>
        <input
          type="text"
          name="projectName"
          id="projectName"
          value={this.state.projectName}
          onChange={this.handleInputChange}
        />
        <Link to={'/'+this.state.projectName}>
          <Button>
            Search
          </Button>
          </Link>
      </div>
    );
  }
}

export { OverlayComponent };
