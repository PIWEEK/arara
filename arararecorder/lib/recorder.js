(function (window) {
  var bufferSize = 2048
  var recording = false
  var socket = null
  var constraints = {
    audio: true,
    video: false
  }

  navigator.mediaDevices.getUserMedia(constraints).then(function (device) {
    processRecording(device)
  }).catch(function (err) {
    alert('Error: device not found.');
  });

  function processRecording(device) {
    audioContext = window.AudioContext || window.webkitAudioContext
    context = new audioContext()
    input = context.createMediaStreamSource(device)

    recorder = context.createScriptProcessor(bufferSize, 1, 1)
    recorder.onaudioprocess = function (e) {
      if (!recording) return;
      var stream = e.inputBuffer.getChannelData(0)

      var encodedStream = convertoFloat32ToInt16(stream)
      socket.send(encodedStream)
    }

    input.connect(recorder)
    recorder.connect(context.destination)
  }

  window.startRecording = function () {
    socket = new WebSocket("ws://localhost:8080")
    socket.binaryType = "arraybuffer"
    recording = true
  }

  window.stopRecording = function () {
    recording = false
    socket.close()
  }

})(this)

function convertoFloat32ToInt16(buffer) {
  var len = buffer.length, i = 0
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
