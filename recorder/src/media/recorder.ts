const TIMESLICE_DURATION : number = undefined


type AudioRecorder = {
  start: () => void,
  stop: () => Promise<AudioRecording>
}

type AudioRecording = {
  blob: Blob,
  url: string,
  audio: HTMLAudioElement
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

  mediaRecorder.addEventListener("dataavailable", event => {
    audioChunks.push(event.data);
  });

  mediaRecorder.addEventListener("error", (err) => {
    reject(err)
  });

  const start = () => mediaRecorder.start(TIMESLICE_DURATION);

  const stop = () =>
    new Promise<AudioRecording>((resolve) => {
      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks,  {type : 'audio/wav'});
        const audioUrl = URL.createObjectURL(audioBlob);
        const recording : AudioRecording = {
          blob: audioBlob,
          url: audioUrl,
          audio: new Audio(audioUrl)
        }
        resolve(recording);
      });

      mediaRecorder.stop();
    });

  resolve({ start, stop });
});

export { getAudioRecorder, AudioRecording, AudioRecorder }