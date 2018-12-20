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
  patterns = []

  constructor(game) {
    this.game = game;
    var options = sceneParams[game.scene.key]
    var recorder = new Recorder(options)

    recorder.startRecording()

    recorder.onTalk = (spell) => {
      console.log(`\nSENTENCE: '${spell || '???'}'`)

      if (!spell.length) return
      var matches = this._getMatches(spell);
      if (matches.length) {
        var count = this.continuous ? matches.length : 1
        this.game.action(count)
      }
    };
  }
  _getMatches(spell) {
      var matches = []
      this.patterns.forEach(pattern => {
        var patterMatches = spell.match(new RegExp(pattern, 'gi')) || []
        if (patterMatches.length) {
          console.log(`SPELL: '${pattern}'`)
        }
        matches = matches.concat(patterMatches || []);
      });
      if (matches.length == 0) {
        console.log(`SPELL: [INVALID]`)
      }
      return matches.length
  }
  setPatterns(patterns) {
    console.log(`Valid patterns: ${patterns}`)
    this.patterns = patterns
  }
}
