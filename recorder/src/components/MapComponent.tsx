import React, { useState } from "react";
import { StorySchema } from "../services/store";

import './styles/map.scss'

type MapProps = {
  stories? : StorySchema[],
  selected? : number,
  showCenterButton: boolean,
  onMarkerClick : (storyId : string) => void
}

const MapComponent = ({ stories = [], selected = null, onMarkerClick } : MapProps) => {
  
  return(
    <div className="map-container">
      <div>Map: {JSON.stringify(stories)}</div>
      <div><button onClick={() => onMarkerClick('28479382-324dfs-3424')}>Marker</button></div>

    </div>
  )
}

export { MapComponent }