import base64 from 'base-64'
import formatDistance from 'date-fns/formatDistance';

function dateFromNow(time : number) {
  return formatDistance(new Date(time), new Date(), { addSuffix: true });
}

function getFilename(blob: Blob) : string {
  console.log(blob)
  switch (blob.type) {
    case 'image/jpeg':
      return 'image.jpg'
    case 'image/png':
      return 'image.png'
    case 'audio/wav':
      return 'audio.wav'
    case 'audio/webm;codecs=opus':
      return 'audio.webm'
    case 'audio/ogg;codecs=opus':
      return 'audio.ogg'
    default:
      return 'unknown.txt'
  }
}

function convertSecondsToMinuteString(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  seconds = Math.floor(seconds % 60)
  const secondString = seconds < 10 ? '0'+seconds : ''+seconds
  return `${minutes}:${secondString}`
}

function generateAuthHeader(name: string, password: string) : { Authorization : string } {
  return {
    "Authorization": `Basic ${base64.encode(`${name}:${password}`)}`
  }
}

export { dateFromNow, getFilename, convertSecondsToMinuteString, generateAuthHeader }