import { Scene } from 'phaser'

import book from '@/game/assets/book.png'
import background from '@/game/assets/game-background.png'
import flaresImg from '@/game/assets/particles/flares.png'
import flaresJSON from '@/game/assets/particles/flares.json'


export default class SplashScene extends Scene {
  constructor () {
    super({ key: 'SplashScene' })
  }

  preload () {
    this.load.image('background', background);
    this.load.image('book', book)
    this.load.atlas('flares', flaresImg, flaresJSON)
  }

  create () {
    this.add.image(0, 0, 'background').setOrigin(0, 0)
    this.add.image(252, 80, 'book').setOrigin(0, 0)

    this.add.rectangle(480, 410, 85, 85)
      .setOrigin(0, 0)
      .setInteractive({useHandCursor: true})
      .on('pointerup', (pointer) => {
        this.scene.start('KnightScene')
      });

    this.input.keyboard.once('keyup_ENTER', () => {
        this.scene.start('KnightScene')
    });

  }

  update () {
  }
}
