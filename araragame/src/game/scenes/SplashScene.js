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

    let diamondArea = this.add.rectangle(480, 410, 85, 85)
      .setOrigin(0, 0)
      .setInteractive({useHandCursor: true})
      .on('pointerup', (pointer) => {
        this.scene.start('KnightScene')
      });

    // Add particles to diamond
    let textures = this.textures;
    let origin = diamondArea.getTopLeft();
    let diamondSource = {
      getRandomPoint: (vec) => {
          do
          {
              var x = Phaser.Math.Between(0, diamondArea.width);
              var y = Phaser.Math.Between(0, diamondArea.height);
              var pixel = 50;
          } while (pixel.alpha < 255);

          return vec.setTo(x + origin.x, y + origin.y);
      }
    };
    
    let particles = this.add.particles('flares');
    particles.createEmitter({
      x: 0,
      y: 0,
      lifespan: 500,
      gravityY: 10,
      scale: { start: 0, end: 0.25, ease: 'Quad.easeOut' },
      alpha: { start: 1, end: 0, ease: 'Quad.easeIn' },
      blendMode: 'ADD',
      emitZone: { type: 'random', source: diamondSource }
    });

    this.input.keyboard.once('keyup_ENTER', () => {
        this.scene.start('KnightScene')
    });

  }

  update () {
  }
}
