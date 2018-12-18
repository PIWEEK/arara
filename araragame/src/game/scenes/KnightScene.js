import { Scene } from 'phaser'

var keySpace;
var tween;

export default class KnightScene extends Scene {
    constructor() {
        super({ key: 'KnightScene' })
    }

    create() {
        this.add.image(0, 0, 'sky').setOrigin(0, 0)
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        var helmet = this.add.image(0, 0, 'helmet').setOrigin(0, 0)

        tween = this.tweens.add({
            targets: helmet,
            props: {
                x: { value: 600, duration: 3000 },
                y: { value: 100, duration: 6000 },
            },
            ease: 'Sine.easeInOut',
            yoyo: false,
            repeat: 0,
            delay: 0,
        })

        tween.pause();
    }

    update() {
        if (keySpace.isDown) {
            tween.resume();
        } else {
            tween.pause();
        }
    }
}
