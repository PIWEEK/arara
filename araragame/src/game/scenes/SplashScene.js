import { Scene } from 'phaser'


export default class SplashScene extends Scene {
  constructor () {
    super({ key: 'SplashScene' })
  }

  create () {
    this.add.image(0, 0, 'sky').setOrigin(0, 0)
    this.add.text(0, 0, 'Presiona enter para empezar..', {
      color: "#fff"
    })

    this.input.keyboard.once('keyup_ENTER', function() {
        this.scene.start('MenuScene')
    }, this)

  }

  update () {
  }
}
