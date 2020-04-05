import React from "react";
import {Component} from 'react';
import ReactMapGL from 'react-map-gl';

import './styles/map.scss'

class MapComponent extends Component {

  state = {
    viewport: {
      width: 400,
      height: 400,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    }
  };

  render() {
    return (
      <div>
        <h1 className="map text">Map</h1>
        <ReactMapGL
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})}/>
      </div>
      
    );
  }
}

export { MapComponent }