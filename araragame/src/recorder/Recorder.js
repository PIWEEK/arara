export default class Recorder {
  ws = null
  bufferSize = 2048
  input = null
  recorder = null
  recording = false
  connected = false
  muteCounter = 0
  speakingCounter = 0
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
      const input = event.inputBuffer.getChannelData(0);
      let i;
      let sum = 0.0;
      for (i = 0; i < input.length; ++i) {
        sum += input[i] * input[i];
      }
      var gain = Math.sqrt(sum / input.length).toFixed(2) * 100
      if (gain > 2) {
        console.log('speaking')
        this.speakingCounter++
        this.ws.send(convertoFloat32ToInt16(input))
      } else if (this.speakingCounter > 0) {
        this.muteCounter++
      }
      if (this.muteCounter == 10 || this.speakingCounter == 20) {
        this.ws.send('transcribe')
        this.muteCounter = 0
        this.speakingCounter = 0
      }
    })
    console.log('Procesor initialized')
  }

  _initializeSocket() {
    this.ws = new WebSocket("ws://localhost:8765")
    this.ws.binaryType = "arraybuffer"

    this.ws.onmessage = ((e) => {
      if (e.data == 'connected') {
        console.log(e.data)
        this.connected = true
      } else {
        this.onTalk(e.data)
      }
    })

    this.ws.onclose = ((e) => {
      if (e.data == 'connected') {
        console.log('Socket closed')
        this.connected = false
      }
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