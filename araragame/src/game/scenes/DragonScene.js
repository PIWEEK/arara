import { Scene } from 'phaser'

export default class DragonScene extends Scene {
    constructor() {
        super({ key: 'DragonScene' })
    }

    create() {
        this.add.image(0, 0, 'sky').setOrigin(0, 0)
    }

    update() {
    }
}
