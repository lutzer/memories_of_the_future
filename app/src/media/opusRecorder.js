import OpusMediaRecorder from 'opus-media-recorder';
import EncoderWorker from 'worker-loader!opus-media-recorder/encoderWorker.js';
import OggOpusWasm from 'opus-media-recorder/OggOpusEncoder.wasm';
import WebMOpusWasm from 'opus-media-recorder/WebMOpusEncoder.wasm';

const workerOptions = {
  encoderWorkerFactory: _ => new EncoderWorker(),
  OggOpusEncoderWasmPath: OggOpusWasm,
  WebMOpusEncoderWasmPath: WebMOpusWasm
};

window.MediaRecorder = OpusMediaRecorder;

async function getOpusMediaRecorder() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  console.log('stream', stream)
  let options = { mimeType: 'audio/webm' };
  return new MediaRecorder(stream, options, workerOptions);;
}

export { getOpusMediaRecorder }