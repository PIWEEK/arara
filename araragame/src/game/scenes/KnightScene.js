import { Scene } from 'phaser'
import GameController from '@/recorder/GameController.js'


import bg_warrior from '@/game/assets/bg_warrior.png'
import head from '@/game/assets/head.svg'
import body from '@/game/assets/body.svg'
import legs from '@/game/assets/legs.svg'
import shield from '@/game/assets/shield.svg'
import stick from '@/game/assets/stick.svg'

let keySpace;
let tween;
let headParticles;
let headParticlesEmitter;


class TweenController {
    scene = null;
    tween = null;

    constructor(scene, tween) {
        this.scene = scene;
        this.tween = tween;
    }

    pushing() {
        this.tween.resume();
        //headParticlesEmitter.on = true;

        setTimeout(() => {
            this.tween.pause();
            //headParticlesEmitter.on = false;
        }, 1000)
    }
}
export default class KnightScene extends Scene {
    tweenController = null;

    constructor() {
        super({ key: 'KnightScene' })
    }

    preload() {
        this.load.image('bg_warrior', bg_warrior)
        this.load.svg('body', body, { width: 200, height: 200 })

        this.load.spritesheet('head', head, { frameWidth: 200, frameHeight: 200 })
    }

    create() {
        this.add.image(0, 0, 'bg_warrior')
            .setDisplaySize(window.innerWidth, window.innerHeight)
            .setOrigin(0, 0)

        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.add.image(200, 600, 'body')

        var head = this.add.sprite(200, 200, 'head')

        //anim head
        var config = {
            key: 'alive',
            frames: this.anims.generateFrameNumbers('head'),
            frameRate: 30,
            yoyo: true,
            repeat: -1
        };

        /*this.anims.create(config);
        head.anims.load('alive')
        head.anims.play('alive')*/

        // Add particles to head
        headParticles = this.add.particles('red');
        headParticlesEmitter = headParticles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            y: 100
        })
        headParticlesEmitter.startFollow(head);
        headParticlesEmitter.enabled = false

        tween = this.tweens.add({
            targets: head,
            props: {
                x: { value: 600, duration: 3000 },
                y: { value: 100, duration: 6000 },
            },
            ease: 'Sine.easeInOut',
            yoyo: false,
            repeat: 0,
            delay: 0,
            onComplete: function () {
                // var parentScene = this.parent.scene
                // parentScene.scene.start('DragonScene')
            }
        })

        tween.pause();

        this.tweenController = new TweenController(this, tween);

        new GameController(this);
    }

    update() {
        if (keySpace.isDown) {
            this.tweenController.pushing();
        }
    }

    action() {
        this.tweenController.pushing();
    }
}
