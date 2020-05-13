const TIMESLICE_DURATION = 50


type AudioRecorder = {
  start: () => void,
  stop: () => void
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
    new Promise(resolve => {
      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        const play = () => audio.play();
        resolve({ audioBlob, audioUrl, play });
      });

      mediaRecorder.stop();
    });

  resolve({ start, stop });
});

export { getAudioRecorder }