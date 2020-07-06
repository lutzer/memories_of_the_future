import React, { useState } from "react";
import { StorySchema } from "../services/store";

type MapProps = {
  stories : StorySchema[],
  onMarkerClick : (storyId : string) => void
}

const MapComponent = ({ stories, onMarkerClick } : MapProps) => {
  
  return(
    <div>
      <div><button onClick={() => onMarkerClick('28479382-324dfs-3424')}>Marker</button></div>
      <div>Map: {JSON.stringify(stories)}</div>
    </div>
  )
}

export { MapComponent }