import { Scene } from 'phaser'


export default class MenuScene extends Scene {
  constructor () {
    super({ key: 'MenuScene' })
  }

  create () {
    this.add.image(0, 0, 'sky').setOrigin(0, 0)

    var context = this
    var sprite = this.add.sprite(0, 0, 'testButton').setOrigin(0, 0).setInteractive();

    sprite.on('pointerdown', function(pointer) {
        this.setTint(0xff0000)
    })

    sprite.on('pointerout', function(pointer) {
        this.clearTint();
    })

    sprite.on('pointerup', function(pointer) {
        this.clearTint();
        context.scene.start('KnightScene')
    })


  }

  update () {
  }
}
