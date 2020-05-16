import React, { useState, useEffect } from "react";
import { Map, TileLayer, Marker, Popup, Viewport } from 'react-leaflet'
import L from 'leaflet'
import _ from 'lodash'

import './styles/location.scss'
import './../../node_modules/leaflet/dist/leaflet.css'
import markerImage from '../assets/marker-icon.png'

// type GeolocationPosition = { lat: number, lng: number }

const icon = L.icon({
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png'
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

const LocationPickerComponent = ({location, onPick} : {location? : [number, number], onPick : (loc : [number, number]) => void}) => {
  const [viewport, setViewport] = useState<Viewport>({ center: [52.672869, 12.988025], zoom: 16 })
  const [dragged, setDragged] = useState(false)

  useEffect( () => {
    if (!location)
      var watchId = navigator.geolocation.watchPosition(updateLocation)
    return function cleanup() {
      if (watchId) 
        navigator.geolocation.clearWatch(watchId)
    }
  },[])

  useEffect( () => {
    if (location)
      setViewport(Object.assign({}, viewport, { center: location }))
  },[location])

  function updateLocation(pos : GeolocationPosition) {
    if (!dragged)
      setViewport(Object.assign({}, viewport, { center: [ pos.coords.latitude, pos.coords.longitude ] }))
  }

  function updateViewport(newViewport : Viewport) {
    if (!_.isEqual(newViewport.center,viewport.center))
      setDragged(true)
    setViewport(newViewport)
  }

  return(
    <div className='location_picker'>
      <Map 
        viewport={viewport}
        onViewportChanged={updateViewport}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </Map>
      <div className="marker">
        <img src={markerImage}/> 
      </div>
      <button onClick={() => onPick(viewport.center)}>Pick Location</button>
    </div>
  )
}

export { LocationPickerComponent }