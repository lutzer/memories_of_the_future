const config : {
  apiAdress: string,
  maxStories : number,
  maxRecordingDuration: number,
  defaultLocation : [number, number]
} = {
  apiAdress : '/api/',
  maxStories : 5,
  maxRecordingDuration: 300, // in seconds
  defaultLocation: [52.508239, 13.329132]
}

export { config }