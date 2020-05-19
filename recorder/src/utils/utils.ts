
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

export { getFilename }