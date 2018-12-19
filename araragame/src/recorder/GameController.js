import Recorder from './Recorder.js'
export default class GameController {
  scene = null
  constructor(scene) {
    var recorder = new Recorder()
    this.scene = scene;
    recorder.startRecording()

    recorder.onTalk = (spell) => {
      // ... function logic ...
      console.log(spell)
      this.scene.action();
      console.log('acción labzada')
    };

    //recorder.stopRecording()
  }
}