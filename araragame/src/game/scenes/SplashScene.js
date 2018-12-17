import { Scene } from 'phaser'


export default class SplashScene extends Scene {
  constructor () {
    super({ key: 'SplashScene' })
  }

  create () {
    this.add.image(400, 300, 'sky')
    this.add.text(400, 550, 'Presiona enter para empezar..')

    this.input.keyboard.once('keyup_ENTER', function() {
        this.scene.start('MenuScene')
    }, this)

  }

  update () {
  }
}
