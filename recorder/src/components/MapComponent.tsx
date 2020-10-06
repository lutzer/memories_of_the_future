/*import React, { useState } from "react";
import { ApiStorySchema } from "../services/api";
import ReactMapGL, { Marker } from "react-map-gl";
import { config } from "../config";
import "./styles/map.scss";

type MapProps = {
  stories: ApiStorySchema[];
  onMarkerClick: (storyId: string) => void;
};

const MapComponent = ({ stories, onMarkerClick }: MapProps) => {
  const [viewport, setViewport] = useState({
    latitude: 52.51763153076172,
    longitude: 13.40965747833252,
    zoom: 3,
  });

  const [story, setStory] = useState({
    stories: { stories },
  });

  return (
    <div>
      <ReactMapGL
        width="100vw"
        height="100vh"
        {...viewport}
        mapboxApiAccessToken={config.mapboxToken}
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
        mapStyle="mapbox://styles/ninoglonti/ck99qscv60l0g1imgpdteyqfw"
      >
        {stories.map((story) => (
          <Marker
            key={story.id}
            latitude={story.location[0]}
            longitude={story.location[1]}
          >
            <button
              className="marker-btn"
              onClick={(story) => {
                console.log("hey I am klicked", story);
                //setStory({story.id});
              }}
            ></button>
          </Marker>
        ))}
      </ReactMapGL>
      */


import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { StorySchema } from "../services/store";

import './styles/map.scss'

type MapProps = {
  stories?: StorySchema[],
  selected?: string,
  showButtons: boolean
}

const MapComponent = ({ stories = [], selected = null, showButtons = true }: MapProps) => {

  const history = useHistory()
  const { projectName } = useParams<{projectName : string}>()

  function onMarkerClick(id : string) {
    history.push(`/${projectName}/stories/${id}`)
  }


  console.log(['selected',selected])

  return (
    <div className="map-container">
      {/* <div>Map: {JSON.stringify(stories)}</div> */}
      {/* <div><a onClick={() => onMarkerClick('28479382-324dfs-3424')}>Marker</a></div> */}
    </div>
  );
};

export { MapComponent };
