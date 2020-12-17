import React, {useState, useEffect } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import _ from 'lodash'
import { config } from "../config";

import './styles/location.scss'
import './styles/input.scss'

type GeolocationPosition = {
  coords: {
    accuracy: number
    altitude: number
    altitudeAccuracy: number
    heading: number
    latitude: number
    longitude: number
    speed: number
  }
}

const LocationMarker = ({location} : {location : [number, number]}) => {
  return(
    <Marker
    latitude={location[0]}
    longitude={location[1]}>
      <div className='marker'>
        <div className ='innerCircle'/>
      </div>
    </Marker>
  )
}

type Viewport = {
  latitude: number
  longitude: number
  zoom: number
}

type Properties = {
  location? : [number, number], 
  defaultLocation : [number, number], 
  onPick : (loc : [number, number]) => void
}

const LocationPickerComponent = ({location, defaultLocation, onPick} : Properties) => {
  const [viewport, setViewport] = useState<Viewport>({ 
    latitude: defaultLocation[0], 
    longitude : defaultLocation[1], 
    zoom: 15
  })
  const [dragged, setDragged] = useState(false)
  const [geolocation, setGeolocation] = useState<GeolocationPosition>(null)
  const [watchId, setWatchId] = useState<number>(null)

  // center on current location, if no location picked already
  useEffect( () => {
    if (!location)
      watchLocation()
  }, [])

  // update viewport when there is a new location set
  useEffect( () => {
    if (location)
      setViewport(Object.assign({}, viewport, { latitude: location[0], longitude: location[1] }))
  },[location])

  // update viewpoert on new geolocation
  useEffect( () => {
    if (geolocation && !dragged)
      setViewport(Object.assign({}, viewport, { latitude: geolocation.coords.latitude, longitude: geolocation.coords.longitude }))
  },[geolocation, watchId])

  // cleanup location listener
  useEffect( () => {
    const watch : number = watchId
    return function cleanup() {
        navigator.geolocation.clearWatch(watch)
    }
  }, [watchId])

  function watchLocation() {
    setDragged(false)
    setWatchId(navigator.geolocation.watchPosition(setGeolocation))
  }

  function onPickButtonClicked() {
    onPick([viewport.latitude, viewport.longitude])
  }

  return(
    <div className='location_picker'>
      <ReactMapGL
        width="100%"
        height="100%"
        {...viewport}
        onTouchMove={() => setDragged(true)}
        onViewportChange={setViewport}
        mapStyle={config.mapboxStyle}
        mapboxApiAccessToken={config.mapboxToken}>
        { location && <LocationMarker location={location}/>}
      </ReactMapGL>
      <div className='crosshair'>
        <svg width='50' height='50'>
          <line x1='0' x2='50' y1='25' y2='25' stroke='black' opacity='0.5' strokeWidth='1'/> 
          <line x1='25' x2='25' y1='0' y2='50' stroke='black' opacity='0.5' strokeWidth='1'/>
        </svg>
      </div>
      <div className='button-group'>
        <button onClick={() => watchLocation()}>Your Location</button>
        <button onClick={() => onPickButtonClicked()}>Pick Location</button>
      </div>
    </div>
  )
}

export { LocationPickerComponent }