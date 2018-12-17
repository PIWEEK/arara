import { Scene } from 'phaser'
import sky from '@/game/assets/sky.png'


export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.load.image('sky', sky)
  }

  create () {
    this.scene.start('SplashScene')
  }
}
