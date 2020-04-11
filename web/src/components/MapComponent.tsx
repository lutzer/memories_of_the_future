import React from "react";
import { Component } from "react";
import ReactMapGL from "react-map-gl";
import { render } from "react-dom";
import "./styles/map.scss";
import { Link } from "react-router-dom";
import { config } from "../config";

class MapComponent extends Component {
  state = {
    viewport: {
      width: "100vw",
      height: "100vh",
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 2,
    },
  };

  render() {
    return (
      <div>
        <div className="formContainer">
          <form>
            <label>Enter Project Name</label> 
            <input 
            type="text" 
            name="projectForm" 
            id="projectForm" />
            <Link className="button submitButton" type="submit" to="/api/projects">
              Submit
            </Link>
          </form>
        </div>

        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({ viewport })}
          mapboxApiAccessToken={config.mapboxToken}
          
        />
      </div>
    );
  }
}

export { MapComponent };
