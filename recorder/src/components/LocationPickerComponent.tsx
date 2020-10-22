import React, {useState, useEffect, createRef } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import _ from 'lodash'
import { config } from "../config";

import './styles/location.scss'
import './../../node_modules/leaflet/dist/leaflet.css'
import '../assets/marker-icon.png'
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
    longitude={location[0]}
    latitude={location[1]}>
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

const LocationPickerComponent = ({location, onPick} : {location? : [number, number], onPick : (loc : [number, number]) => void}) => {
  const [viewport, setViewport] = useState<Viewport>({ 
    latitude: config.defaultLocation[0], 
    longitude : config.defaultLocation[1], 
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
      setViewport(Object.assign({}, viewport, { longitude: location[0], latitude: location[1] }))
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
    onPick([viewport.longitude, viewport.latitude])
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