import { Scene } from 'phaser'

import book from '@/game/assets/book.png'
import background from '@/game/assets/game-background.png'

export default class SplashScene extends Scene {
  constructor () {
    super({ key: 'SplashScene' })
  }

  preload () {
    this.load.image('background', background);
    this.load.image('book', book)
  }

  create () {
    this.add.image(0, 0, 'background').setOrigin(0, 0)
    this.add.image(252, 80, 'book').setOrigin(0, 0)

    this.input.keyboard.once('keyup_ENTER', function() {
        this.scene.start('MenuScene')
    }, this)

  }

  update () {
  }
}
