import Recorder from './Recorder.js'

const sceneParams = {
  KnightScene: {
    segmentSize: 2048, // Size of each segment in bytes
    batchNumSegments: 30, // Num of segments sent for each bacth
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
  options = {}
  patterns = []

  constructor(game) {
    this.game = game;
    this.options = sceneParams[game.scene.key]
    this.recorder = new Recorder(this.options)

    this.recorder.startRecording()

    this.recorder.onTalk = (spell) => {
      console.log(`\nYou said: '${spell || '???'}'`)

      if (!spell.length) return
      var numMatches = this._getMatches(spell);
      if (numMatches > 0) {
        var count = this.options.continuous ? numMatches : 1
        this.game.action(count)
      }
    };
  }
  _getMatches(spell) {
      var numMatches = 0
      this.patterns.forEach(pattern => {
        if (this.options.continuous) {
          var patternMatches = spell.match(new RegExp(pattern, 'gi')) || []
          numMatches += patternMatches.length;
        } else { 
          numMatches += (pattern == spell) ? 1 : 0;
        }
      });
      console.log(`${numMatches} matches`)
      return numMatches
  }
  setPatterns(patterns) {
    console.log(`\n\nValid patterns: ${patterns}\n\n`)
    this.patterns = patterns
  }
  destroyRecorder() {
    this.recorder.stopRecording()
  }
}
