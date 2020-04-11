import React from "react";
import { Component } from "react";
import { render } from "react-dom";

class OverlayComponent extends Component {
  state = {
    name: ""
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  handleSubmit = event => {
    event.preventDefault();

    
  }


  render() {
    return (
      <div className= "overlayContainer">
        <form onSubmit={this.handleSubmit}>
        <label>Enter Project Name</label>
        <input type="text"
         name="projectName"
         id="projectName"
         />
         <button className = "projectSearch">Search</button>
         </form>
      </div>
    );
  }
}

export { OverlayComponent };
