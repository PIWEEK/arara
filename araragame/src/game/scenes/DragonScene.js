import { Scene } from 'phaser'

export default class DragonScene extends Scene {
    constructor() {
        super({ key: 'DragonScene' })
    }

    create() {
        this.add.image(0, 0, 'sky').setOrigin(0, 0)
        this.add.image(50, 200, 'dragon').setOrigin(0, 0)
        this.add.image(150, 200, 'fireball').setOrigin(0, 0)

    }

    update() {
    }
}
