export default class Recorder {
  // options
  segmentSize = null
  batchNumSegments = null
  speakingDetectionLevel = null
  // flags
  recording = false
  connected = false
  // counters
  muteSegments = 0
  speakingSegments = 0
  // resources
  ws = null
  input = null
  recorder = null
  // events
  onTalk() {}

  constructor(options) {
    this.segmentSize = options.segmentSize || 2048
    this.batchNumSegments = options.batchNumSegments || 15
    this.speakingDetectionLevel = options.speakingDetectionLevel || 2

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

    this.recorder = context.createScriptProcessor(this.segmentSize, 1, 1)
    this.recorder.connect(context.destination)

    this.input = context.createMediaStreamSource(device)
    this.input.connect(this.recorder)

    console.log('Recorder initialized')
  }
  _initializeProcesor() {
    this.recorder.onaudioprocess = ((e) => {
      if (!this.recording || !this.connected) return;
      const input = event.inputBuffer.getChannelData(0);
      let i;
      let sum = 0.0;
      for (i = 0; i < input.length; ++i) {
        sum += input[i] * input[i];
      }
      var gain = Math.sqrt(sum / input.length).toFixed(2) * 100
      
      if (gain > this.speakingDetectionLevel) {
        this.speakingSegments++
        console.log('speaking')
      } else if (this.speakingSegments > 0) {
        this.muteSegments++
      } else return

      this.ws.send(convertoFloat32ToInt16(input))
      
      console.log(this.muteSegments + this.speakingSegments)
      if ((this.muteSegments + this.speakingSegments) >= this.batchNumSegments) {
        this.ws.send('transcribe')
        this.muteSegments = 0
        this.speakingSegments = 0
      }
    })
    console.log('Procesor initialized')
  }

  _initializeSocket() {
    this.ws = connect(this.onTalk)
    this.ws.onopen = ((e) => {
      setInterval(() => {
        this.connected = (this.ws.readyState == 1)
        if (!this.connected) { 
          this.ws = connect(this.onTalk)
        }
      }, 1000);
    })

    function connect(onMessage) {
      var ws = new WebSocket("ws://localhost:8765")
      ws.binaryType = "arraybuffer"
      ws.onmessage = ((e) => {
        onMessage(e.data)
      })
      return ws
    }
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