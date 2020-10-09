
import React, { useState, useEffect } from "react";
import { StorySchema, Store, ProjectSchema } from "../services/store";
import ReactMapGL, { Marker } from "react-map-gl";
import { config } from "../config";
import './styles/map.scss'
import { useHistory, useParams } from 'react-router-dom'
import { HeaderComponent } from "./HeaderComponent";

type MapProps = {
  stories?: StorySchema[],
  selected?: string,
  showButtons: boolean
}

const MapComponent = ({ stories = [], selected = null, showButtons = true }: MapProps) => {

 
  const [viewport, setViewport] = useState({
    latitude: 52.51763153076172,
    longitude: 13.40965747833252,
    zoom: 3,
  });

  const [story, setStory] = useState({
    stories: { stories },
  });

  const history = useHistory() 
  const { projectName } = useParams <{projectName : string}> ()
  

  function onMarkerClick (id : string) {
     history.push(`/${projectName}/stories/${id}`)
  }
 

  return (
    <div className="map-container">
      <ReactMapGL
        width="100vw"
        height="100vh"
        {...viewport}
        mapboxApiAccessToken={config.mapboxToken}
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
        mapStyle="mapbox://styles/tommasuki/ckemlgukz2ekk19lq0udzo4n7"
      > 
      
        {stories.map((story) => (
        <Marker
            key = {story.id}
            latitude={story.location[0]}
            longitude={story.location[1]}
            >
            <div className="markerBorder" style = {{backgroundColor: story.color + "55"}}  onClick = {() => onMarkerClick(story.id) }>
             <div style = {{backgroundColor: story.color}} className = 'storyBtn'/>
            </div>
          </Marker>   
          
        ))}
          

      </ReactMapGL>
      <HeaderComponent/>
     
    </div >
  );
};

export { MapComponent };
