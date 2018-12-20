import Recorder from './Recorder.js'

const sceneParams = {
  KnightScene: {
    segmentSize: 2048, // Size of each segment in bytes
    batchNumSegments: 15, // Num of segments sent for each bacth
    speakingDetectionLevel: 2 // Volume required for voice detection
  },
  DragonScene: {
    segmentSize: 2048, // Size of each segment in bytes
    batchNumSegments: 15, // Num of segments sent for each bacth
    speakingDetectionLevel: 2 // Volume required for voice detection
  }
}

export default class GameController {
  game = null
  constructor(game) {
    this.game = game;
    var params = sceneParams[game.scene.key]
    var recorder = new Recorder(params)

    recorder.startRecording()

    recorder.onTalk = (spell) => {
      // ... function logic ...
      console.log(spell)
      this.game.action();
      console.log('acción labzada')
    };

    //recorder.stopRecording()
  }
}