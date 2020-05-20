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

const getAudioRecorder = () : Promise<AudioRecorder> =>
new Promise(async (resolve, reject) => {
  let mediaRecorder : MediaRecorder = null

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
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