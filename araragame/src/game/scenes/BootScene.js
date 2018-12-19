import { Scene } from 'phaser'
import sky from '@/game/assets/sky.png'
import testButton from '@/game/assets/test-button-min.png'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.load.image('sky', sky)
    this.load.image('testButton', testButton)
  }

  create () {
    this.scene.start('SplashScene')
  }
}
