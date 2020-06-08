import React from "react";
import { Component } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { render } from "react-dom";
import "./styles/map.scss";
import { OverlayComponent } from "./OverlayComponent";
import { config } from "../config";

class MapComponent extends Component {
  constructor() {
    super();
    this.state = {
      viewport: {
        width: "100vw",
        height: "100vh",
        latitude: 52.51763153076172,
        longitude: 13.40965747833252,
        zoom: 3,
      },
    };
  }

  render() {
    return (
      <div className="startMap">
        <OverlayComponent />
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({ viewport })}
          mapboxApiAccessToken={config.mapboxToken}
          mapStyle="mapbox://styles/ninoglonti/ck99qscv60l0g1imgpdteyqfw"
        />
      </div>
    );
  }
}

export { MapComponent };
