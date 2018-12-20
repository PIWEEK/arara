import { Scene } from 'phaser'
import testButton from '@/game/assets/test-button-min.png'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.load.image('testButton', testButton)
  }

  create () {
    this.scene.start('SplashScene')
  }
}
