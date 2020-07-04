import React, { useState } from "react";
import { ApiStorySchema } from "../services/api";

type MapProps = {
  stories : ApiStorySchema[],
  onMarkerClick : (storyId : string) => void
}

const MapComponent = ({ stories, onMarkerClick } : MapProps) => {
  
  return(
    <div>
      <div><button onClick={() => onMarkerClick('dlsfjl')}>Marker</button></div>
      <div>Map: {JSON.stringify(stories)}</div>
    </div>
  )
}

export { MapComponent }