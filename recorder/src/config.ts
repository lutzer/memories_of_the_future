const config: {
  apiAdress: string;
  maxStories: number;
  maxRecordingDuration: number;
  defaultLocation: [number, number];
  mapboxToken: string;
} = {
  apiAdress: "/api/",
  maxStories: 5,
  maxRecordingDuration: 300, // in seconds
  defaultLocation: [52.508239, 13.329132],
  mapboxToken:
    "pk.eyJ1Ijoibmlub2dsb250aSIsImEiOiJjazhvYzR1aWUwMWZqM2xtejA2b2Jvd2FrIn0.oIyykX1DyYDJ6jZKNyg0Nw",
};

export { config };
