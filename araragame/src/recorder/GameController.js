import Recorder from './Recorder.js'
export default class GameController {
  constructor() {
    var recorder = new Recorder()

    recorder.startRecording()

    recorder.onTalk = function (spell) {
      // ... function logic ...
      console.log(spell)
    };
    
    //recorder.stopRecording()
  }
}