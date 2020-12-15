import OpusMediaRecorder from 'opus-media-recorder';
// Choose desired format like audio/webm. Default is audio/ogg
const options = { mimeType: 'audio/ogg' }
// Web worker and .wasm configuration. Note: This is NOT a part of W3C standard.
const workerOptions = {
  encoderWorkerFactory: function () {
    // UMD should be used if you don't use a web worker bundler for this.
    return new Worker('opus/encoderWorker.umd.js')
  },
  OggOpusEncoderWasmPath: 'opus/OggOpusEncoder.wasm',
  WebMOpusEncoderWasmPath: 'opus/WebMOpusEncoder.wasm'
};

if (!window.MediaRecorder)
  window.MediaRecorder = OpusMediaRecorder;
// recorder = new MediaRecorder(stream, options, workerOptions);