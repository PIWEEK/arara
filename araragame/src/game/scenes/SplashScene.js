import { Scene } from 'phaser'

import book from '@/game/assets/book.png'
import background from '@/game/assets/game-background.png'
import hitboxSprite from '@/game/assets/hitbox.png'

export default class SplashScene extends Scene {
  constructor () {
    super({ key: 'SplashScene' })
  }

  preload () {
    this.load.image('background', background);
    this.load.image('book', book)
    this.load.image('hitbox', hitboxSprite)  
  }

  create () {
    this.add.image(0, 0, 'background').setOrigin(0, 0)
    this.add.image(252, 80, 'book').setOrigin(0, 0)
    this.hitbox = this.add.sprite(485, 410, 'hitbox').setOrigin(0,0).setScale(1.5).setInteractive();
    // this.hitbox.setAlpha(0);

    this.hitbox.on('pointerup', (pointer) => {
      this.scene.start('KnightScene')
    });

    this.input.keyboard.once('keyup_ENTER', () => {
        this.scene.start('KnightScene')
    });

  }

  update () {
  }
}
