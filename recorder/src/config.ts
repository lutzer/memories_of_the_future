const config : {
  apiAdress: string,
  maxStories : number,
  maxRecordingDuration: number,
  defaultLocation : [number, number]
} = {
  apiAdress : 'http://192.168.2.119:3000/api/',
  maxStories : 5,
  maxRecordingDuration: 300, // in seconds
  defaultLocation: [52.508239, 13.329132]
}

export { config }