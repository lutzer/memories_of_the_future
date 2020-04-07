import React from "react";
import { Component } from "react";
import { render } from "react-dom";

class OverlayComponent extends Component {
  render() {
    return (
      <div className= "overlayContainer">
        <h4>Enter Project Name</h4>;
        <input type="text"
         name="projectName"
         id="projectName"
         />
      </div>
    );
  }
}

export { OverlayComponent };
