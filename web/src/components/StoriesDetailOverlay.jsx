import React from "react";
import { Component } from "react";
import "./styles/map.scss";

class StoriesDetailOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Hey I am story overlay",
    };
  }

  render() {
    return (
      <div>
        {this.state.message ? (
          <div className="projectOverlay">
            <h1>{this.state.message}</h1>
            <button
              onClick={(e) => {
                e.preventDefault();
                this.setState({ message: null });
              }}
            >
              --
            </button>
          </div>
        ) : null}
      </div>
    );
  }
}

export { StoriesDetailOverlay };
