
import React, { DOMElement, useEffect, useRef, useState } from "react";
import { StorySchema } from "../services/store";
import ReactMapGL, { FlyToInterpolator, Marker, ViewportProps, WebMercatorViewport } from "react-map-gl";
import { config } from "../config";
import { useHistory, useParams } from 'react-router-dom'
import { HeaderComponent } from "./HeaderComponent";
import bbox from '@turf/bbox'

import './styles/map.scss'
import _ from "lodash";

type MapProps = {
  stories?: StorySchema[],
  selected?: string,
  projectView: boolean
}

function calculateBoundingBox(locations : [number, number][]) {
  return bbox({
    "type": "MultiPoint",
    "coordinates": locations
  })
}

// function cubicInOut(t : number) {
//   return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
// }

const StoryMarker = ({ story, selected, onClick } : 
  { story : StorySchema, selected : boolean, onClick : (id: string) => void }) => {
  return(
    <Marker
      key = {story.id}
      latitude={story.location[0]}
      longitude={story.location[1]}>
      <div className={'storyMarkerOuter' + (selected ? ' selected' : '')} style = {{backgroundColor: story.color + "55"}}  onClick = {() => onClick(story.id) }>
        <div  className='storyMarkerInner' style = {{backgroundColor: story.color}}/>
      </div>
    </Marker>   
  )
}

const MapComponent = ({ stories = [], selected = null, projectView = true }: MapProps) => {
  const container = useRef<HTMLDivElement>(null);
  const history = useHistory() 
  const { projectName } = useParams <{projectName : string}> ()

  const [viewport, setViewport] = useState({
    width: 10,
    height: 10,
    latitude: 52.51763153076172,
    longitude: 13.40965747833252,
    zoom: 3
    // transitionDuration: 1000
    // transitionInterpolator: new FlyToInterpolator()
    // transitionEasing: cubicInOut
  });

  function onMarkerClick (id : string) {
     history.push(`/${projectName}/stories/${id}`)
  }

  function handleResize() {
    setViewport(Object.assign({},viewport, {
      height: container.current.clientHeight,
      width: container.current.clientWidth
    }))
  }

  // on new stories loaded
  useEffect(() => {
    if (!_.isEmpty(stories)) {
      const bbox = calculateBoundingBox(stories.map((story) => story.location))
      const boundingViewport = new WebMercatorViewport({width: viewport.width, height: viewport.height})
        .fitBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]], {
          padding: 50
        })
      setViewport({...viewport,
        latitude: boundingViewport.latitude,
        longitude: boundingViewport.longitude,
        zoom: (boundingViewport.zoom > config.mapMaxZoom) ? config.mapMaxZoom : boundingViewport.zoom
      })
    }
  },[stories])

  // on story selected
  useEffect(() => {
    if (!_.isEmpty(stories) && selected) {
      const story = stories.find((story) => story.id === selected)
      if (story) {
        setViewport({...viewport, latitude: story.location[0], longitude: story.location[1]})
      }
    }
  },[selected])

  // listen to window resizes
  useEffect(() => {  
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  },[])

  // resize when view changes
  useEffect(() => {
    handleResize()
  }, [projectView])

  return (
    <div className={'map-container' + (projectView ? '' : ' fullscreen')}  ref={container}>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={config.mapboxToken}
        onViewportChange={setViewport}
        mapStyle={config.mapboxStyle}
        maxZoom={config.mapMaxZoom}
        // transitionDuration={200}
        // transitionInterpolator={new FlyToInterpolator()}
        > 
        {stories.map((story, i) => {
          return <StoryMarker key={i} selected={story.id == selected} story={story} onClick={onMarkerClick}/> 
        })}
      </ReactMapGL>
      <HeaderComponent/>
    </div >
  );
};

export { MapComponent };
