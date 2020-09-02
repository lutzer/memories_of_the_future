import React, { useState, useEffect } from "react";
import { StorySchema } from "../services/store";

import './styles/map.scss'

type MapProps = {
  stories? : StorySchema[],
  selected? : string,
  showButtons: boolean,
  onMarkerClick : (storyId : string) => void
}

const MapComponent = ({ stories = [], selected = null, onMarkerClick } : MapProps) => {
  
  return(
    <div className="map-container">
      {/* <div>Map: {JSON.stringify(stories)}</div> */}
      {/* <div><a onClick={() => onMarkerClick('28479382-324dfs-3424')}>Marker</a></div> */}
    </div>
  )
}

export { MapComponent }