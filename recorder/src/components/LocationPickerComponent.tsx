import React, {Fragment, useState, useEffect } from "react";
import { Map, TileLayer, Marker, CircleMarker, Viewport } from 'react-leaflet'
import L, { GeoJSONOptions } from 'leaflet'
import _ from 'lodash'
import { config } from "../config";

import './styles/location.scss'
import './../../node_modules/leaflet/dist/leaflet.css'
import '../assets/marker-icon.png'
import './styles/input.scss'

// type GeolocationPosition = { lat: number, lng: number }

const markerIcon = L.icon({
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12.5, 30]
});

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

const LocationMarker = ({geoLoc, zoom} : {geoLoc: GeolocationPosition, zoom : number}) => {

  function calculateAccuracyRadius() {
    return geoLoc.coords.accuracy
  }

  return(
    <Fragment>
      <CircleMarker
        radius={calculateAccuracyRadius()}
        fillColor='#00a2ff'
        fillOpacity={0.3}
        stroke={false}
        center={[geoLoc.coords.latitude, geoLoc.coords.longitude]}
        />
      <CircleMarker
        radius={8}
        color='#ffffff'
        weight={2}
        fillOpacity={1.0}
        fillColor='#00a2ff'
        center={[geoLoc.coords.latitude, geoLoc.coords.longitude]}/>
    </Fragment>
  )
}

const LocationPickerComponent = ({location, onPick} : {location? : [number, number], onPick : (loc : [number, number]) => void}) => {
  const [viewport, setViewport] = useState<Viewport>({ center: config.defaultLocation, zoom: 16 })
  const [dragged, setDragged] = useState(false)
  const [geolocation, setGeolocation] = useState<GeolocationPosition>(null)
  const [watchId, setWatchId] = useState(null)

  // update viewport when there is a new location set
  useEffect( () => {
    if (location)
      setViewport(Object.assign({}, viewport, { center: location }))
  },[location])

  // update viewpoert on new geolocation
  useEffect( () => {
    if (geolocation && !dragged)
      setViewport(Object.assign({}, viewport, { center: [ geolocation.coords.latitude, geolocation.coords.longitude ] }))
  },[geolocation])

  // cleanup location listener
  useEffect( () => {
    return function cleanup() {
      if (watchId)
        navigator.geolocation.clearWatch(watchId)
    }
  }, [watchId])

  // start watching geolocation
  function watchLocation() {
    setDragged(false)
    if (watchId)
      navigator.geolocation.clearWatch(watchId)
    setWatchId(navigator.geolocation.watchPosition(setGeolocation))
  }

  return(
    <div className='location_picker'>
      <Map 
        viewport={viewport}
        ondrag={() => setDragged(true)}
        onViewportChanged={setViewport}
        zoomControl={false}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        { location && <Marker
          icon={markerIcon}
          position={location}
        /> }
        { geolocation && <LocationMarker geoLoc={geolocation} zoom={viewport.zoom}/> }
      </Map>
      <div className='crosshair'>
        <svg width='50' height='50'>
          <line x1='0' x2='50' y1='25' y2='25' stroke='black' opacity='0.5' strokeWidth='1'/> 
          <line x1='25' x2='25' y1='0' y2='50' stroke='black' opacity='0.5' strokeWidth='1'/>
        </svg>
      </div>
      <div className='button-group'>
        <button onClick={watchLocation}>Your Location</button>
        <button onClick={() => onPick(viewport.center)}>Pick Location</button>
      </div>
    </div>
  )
}

export { LocationPickerComponent }