import Recorder from './Recorder.js'

const sceneParams = {
  KnightScene: {
    segmentSize: 2048, // Size of each segment in bytes
    batchNumSegments: 15, // Num of segments sent for each bacth
    speakingDetectionLevel: 2, // Volume required for voice detection
    continuous: true
  },
  DragonScene: {
    segmentSize: 2048, // Size of each segment in bytes
    batchNumSegments: 10, // Num of segments sent for each bacth
    speakingDetectionLevel: 2, // Volume required for voice detection
    continuous: false
  }
}

export default class GameController {
  game = null
  constructor(game, pattern) {
    this.game = game;
    var options = sceneParams[game.scene.key]
    var recorder = new Recorder(options)

    recorder.startRecording()

    recorder.onTalk = (spell) => {
      if (!spell.length) return
      var matches = spell.match(new RegExp(pattern, 'gi'));
      if (!matches) return

      console.log(`${matches.length} matches found of '${pattern}' in '${spell}'`);

      // ... function logic ...
      if (options.continuous) {
        matches.forEach(match => {
          this.game.action();
        });
      } else {
        this.game.action();
      }
    };

    //recorder.stopRecording()
  }
}