import { Scene } from 'phaser'
import sky from '@/game/assets/sky.png'
import testButton from '@/game/assets/test-button-min.png'
import helmet from '@/game/assets/helmet.png'
import dragon from '@/game/assets/dragon.png'
import fireball from '@/game/assets/fireball.png'
import shield from '@/game/assets/shield.png'
import knight from '@/game/assets/knight.png'


export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.load.image('sky', sky)
    this.load.image('testButton', testButton)
    this.load.image('helmet', helmet)
    this.load.image('dragon', dragon)
    this.load.image('fireball', fireball)
    this.load.image('shield', shield)
    this.load.image('knight', knight)
  }

  create () {
    this.scene.start('SplashScene')
  }
}
