import { Scene } from 'phaser'


export default class KnightScene extends Scene {
    constructor() {
        super({ key: 'KnightScene' })
    }

    create() {
        this.add.image(400, 300, 'sky')

        var helmet = this.add.image(100, 400, 'helmet')

        this.tweens.add({
            targets: helmet,
            props: {
                x: { value: 600, duration: 3000 },
                y: { value: 100, duration: 6000 },
            },
            ease: 'Sine.easeInOut',
            yoyo: false,
            repeat: 0,
            delay: 2000,
        })
    }
}
