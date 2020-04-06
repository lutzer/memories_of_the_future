import React from "react";
import {Component} from 'react';
import ReactMapGL from 'react-map-gl';
import {render} from 'react-dom';
import './styles/map.scss'
const MAPBOX_TOKEN="pk.eyJ1Ijoibmlub2dsb250aSIsImEiOiJjazhvYzR1aWUwMWZqM2xtejA2b2Jvd2FrIn0.oIyykX1DyYDJ6jZKNyg0Nw"

class MapComponent extends Component {

  state = {

    viewport: {
      width: "100vw",
      height: "100vh",
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 2
    }
  };

  render() {
    return (
      <div>
        <ReactMapGL
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})} 
        mapboxApiAccessToken={MAPBOX_TOKEN}



        />
      </div>
      
    );
  }
}

export { MapComponent }