import React from "react";
import {Component} from 'react';
import ReactMapGL from 'react-map-gl';
import {render} from 'react-dom';
import './styles/map.scss'
import {OverlayComponent} from "./OverlayComponent"
import { config } from './../config'

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
        <div id="formContainer">
          <form>
            <label htmlFor=""></label>
            <input type="text"/>
          </form>
        </div>
        <ReactMapGL
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})} 
        mapboxApiAccessToken={config.mapboxToken}
        />
        <OverlayComponent/>
      </div>
      
    );
  }
}

export { MapComponent }