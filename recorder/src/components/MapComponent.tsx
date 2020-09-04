import React, { useState } from "react";
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
    </div>
  );
};

export { MapComponent };
