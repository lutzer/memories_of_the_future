const config: {
  apiAdress: string
  maxStories: number
  maxRecordingDuration: number
  mapboxToken: string
  mapboxStyle : string
  mapMaxZoom: number
} = {
  apiAdress: "/api/",
  maxStories: 5,
  maxRecordingDuration: 300, // in seconds
  mapboxToken: "pk.eyJ1Ijoibmlub2dsb250aSIsImEiOiJjazhvYzR1aWUwMWZqM2xtejA2b2Jvd2FrIn0.oIyykX1DyYDJ6jZKNyg0Nw",
  mapboxStyle: "mapbox://styles/tommasuki/ckemlgukz2ekk19lq0udzo4n7",
  mapMaxZoom: 15
  //mapboxStyle: "mapbox://styles/tommasuki/ckeefto7f0v8n19s0s7kgugd4"
};

export { config };
