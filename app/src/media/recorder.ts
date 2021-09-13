/// <reference path="../../node_modules/@types/dom-mediacapture-record/index.d.ts" />

const TIMESLICE_DURATION : number = undefined

type AudioRecorder = {
  start: () => void,
  stop: () => Promise<AudioRecording>,
  getTime: () => number
}

type AudioRecording = {
  blob: Blob,
  duration: number
}

function getSupportedMimeType() : string {
  var types = [
    'audio/webm',
    'audio/ogg',
    'audio/wav',
    'audio/m4a'
  ];

  for (var i in types) {
    if (MediaRecorder.isTypeSupported(types[i])) return types[i]
  }
  return ''
}



const getAudioRecorder = () : Promise<AudioRecorder> =>
new Promise(async (resolve, reject) => {
  let mediaRecorder : MediaRecorder = null

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: getSupportedMimeType()
    });
  } catch (err) {
    reject(err)
    return
  }
  
  const audioChunks : any = [];
  var startTimeOfRecording : number = null;
  var endTimeOfRecording : number = null;

  mediaRecorder.addEventListener("dataavailable", event => {
    audioChunks.push(event.data);
  });

  mediaRecorder.addEventListener("error", (err) => {
    reject(err)
  });

  const start = () => {
    startTimeOfRecording = Date.now();
    mediaRecorder.start(TIMESLICE_DURATION);
  }

  const stop = () => {
    endTimeOfRecording = Date.now()
    return new Promise<AudioRecording>((resolve) => {
      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks,  {type : mediaRecorder.mimeType});
        const recording : AudioRecording = {
          blob: audioBlob,
          duration: endTimeOfRecording - startTimeOfRecording
        }
        resolve(recording);
      });

      mediaRecorder.stop();
    });
  }

  const getTime = () : number => {
    if (!startTimeOfRecording)
      return 0
    if (endTimeOfRecording)
      return endTimeOfRecording = startTimeOfRecording
    else
      return Date.now() - startTimeOfRecording
  }

  resolve({ start, stop, getTime });
});

export { getAudioRecorder, AudioRecording, AudioRecorder }