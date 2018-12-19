export default class Recorder {
  ws = null
  bufferSize = 2048
  input = null
  recorder = null
  recording = false
  onTalk() {}

  constructor() {
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    }).then((device) => {
      this._initializeRecorder(device)
      this._initializeSocket()
      this._initializeProcesor()
    })
  }
  _initializeRecorder(device) {
    var audioContext = window.AudioContext || window.webkitAudioContext
    var context = new audioContext()

    this.recorder = context.createScriptProcessor(this.bufferSize, 1, 1)
    this.recorder.connect(context.destination)

    this.input = context.createMediaStreamSource(device)
    this.input.connect(this.recorder)

    console.log('Recorder initialized')
  }
  _initializeProcesor() {
    this.recorder.onaudioprocess = ((e) => {
      if (!this.recording) return;
      var stream = e.inputBuffer.getChannelData(0)
      var encodedStream = convertoFloat32ToInt16(stream)
      this.ws.send(encodedStream)
    })
    console.log('Procesor initialized')
  }

  _initializeSocket() {
    this.ws = new WebSocket("ws://localhost:8080")
    this.ws.binaryType = "arraybuffer"

    console.log('Socket initialized')

    this.ws.onmessage = ((e) => {
      this.onTalk(e.data)
    })
  }

  startRecording() {
    this.recording = true
    console.log('Recording started')
  }

  stopRecording() {
    this.recording = false
    console.log('Recording stopped')
  }

}

function convertoFloat32ToInt16(buffer) {
  var len = buffer.length,
    i = 0
  var dataAsInt16Array = new Int16Array(len)

  while (i < len) {
    dataAsInt16Array[i] = convert(buffer[i++])
  }

  return dataAsInt16Array;

  function convert(n) {
    var v = n < 0 ? n * 32768 : n * 32767;
    return Math.max(-32768, Math.min(32768, v))
  }
}