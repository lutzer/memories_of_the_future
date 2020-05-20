
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

export { getFilename, convertSecondsToMinuteString }