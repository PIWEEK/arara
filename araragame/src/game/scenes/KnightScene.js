import { Scene } from 'phaser'

let keySpace;
let tween;
let helmetParticles;
let helmetParticlesEmitter;

export default class KnightScene extends Scene {
    constructor() {
        super({ key: 'KnightScene' })
    }

    create() {
        this.add.image(0, 0, 'sky').setOrigin(0, 0)
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        var helmet = this.add.image(0, 0, 'helmet').setOrigin(0, 0)
        
        // Add particles to helmet
        helmetParticles = this.add.particles('red');
        helmetParticlesEmitter = helmetParticles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            y: 100
        })
        helmetParticlesEmitter.startFollow(helmet);
        helmetParticlesEmitter.enabled = false
      
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
            helmetParticlesEmitter.on = true
        } else {
            helmetParticlesEmitter.on = false
            tween.pause();
        }
    }
}
