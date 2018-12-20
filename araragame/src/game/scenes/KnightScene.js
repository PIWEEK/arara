import { Scene } from 'phaser'
import GameController from '@/recorder/GameController.js'


import background from '@/game/assets/game-background.png'
import head from '@/game/assets/head.svg'
import body from '@/game/assets/body.svg'
import legs from '@/game/assets/legs.svg'
import shield from '@/game/assets/shield.svg'
import stick from '@/game/assets/stick.svg'

const POSITIONS = {
    BODY_ORIGIN: {x: 100, y: 300},
    BODY_OFFSET: {x: 800, y: 150},
}

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

        setTimeout(() => {
            this.tween.pause();
        }, 2000)
    }
}

class Transition {
    scene = null;
    controller = null;
    origin = null;
    target = null;
    element = null;

    constructor(scene, origin, offset, resource) {
        this.scene = scene;
        this.origin = origin;
        this.offset = offset;
        this.element = this.scene.add.image(this.origin.x, this.origin.y, resource);
        this.setTweenController();
    }

    setTweenController() {
        let tween = this.scene.tweens.add({
            targets: this.element,
            props: {
                x: { value: this.offset.x, duration: 10000, ease: 'Power2' },
                y: { value: this.offset.y, duration: 12000, ease: 'Sine.easeInOut' },
            },
            yoyo: false,
            repeat: 0,
            delay: 0,
            onComplete:  () => {
                this.scene.nextTransition();
            }
        })

        tween.pause();

        this.controller = new TweenController(this, tween);
    }
}
export default class KnightScene extends Scene {
    transitions = [];
    transition = null;

    constructor() {
        super({ key: 'KnightScene' })
    }

    preload() {
        this.load.image('background', background)
        this.load.svg('body', body, { width: 200, height: 200 })
    }

    create() {
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.add.image(0, 0, 'background')
            .setDisplaySize(window.innerWidth, window.innerHeight)
            .setOrigin(0, 0)

        // Add particles to head
        headParticles = this.add.particles('red');
        headParticlesEmitter = headParticles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            y: 100
        });

        headParticlesEmitter.startFollow(head);
        headParticlesEmitter.enabled = false

        this._setTransitions();
        this.nextTransition();

        new GameController(this);
    }

    update() {
        if (keySpace.isDown) {
            this.transition.controller.pushing();
        }
    }

    action() {
        this.transition.controller.pushing();
    }

    _setTransitions() {
        this.transitions.push(new Transition(this, POSITIONS.BODY_ORIGIN, POSITIONS.BODY_OFFSET, 'body'));
        this.transitions.push(new Transition(this, POSITIONS.BODY_ORIGIN, POSITIONS.BODY_OFFSET, 'body'));
        this.transitions.push(new Transition(this, POSITIONS.BODY_ORIGIN, POSITIONS.BODY_OFFSET, 'body'));
    }

    nextTransition() {
        console.log('next')
        if ( this.transitions.length > 0) {
            this.transition = this.transitions.shift();
        }
        else {
            console.log('game complete');
        }
    }
}
