var express = require('express')
var app = express()
app.use(express.static(__dirname))
app.get('/', function (req, res) {
  res.render('index')
});
app.listen(9000)

var wav = require('wav')
var outFile = 'test.wav'
var fileWriter = new wav.FileWriter(outFile, {
  channels: 1,
  sampleRate: 48000,
  bitDepth: 16
})

const WebSocket = require('ws')
const wss = new WebSocket.Server({
  port: 8080
})

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log(message)
    fileWriter.write(message)
  })
})

wss.on('close', function () {
  fileWriter.end();
})
