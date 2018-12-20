import { Scene } from 'phaser'
import GameController from '@/recorder/GameController.js'


import background from '@/game/assets/bg_warrior.png'
import head from '@/game/assets/head.png'
import body from '@/game/assets/body.png'
import legs from '@/game/assets/legs.png'
import armor from '@/game/assets/armor.png'
import shield from '@/game/assets/shield.png'
import stick from '@/game/assets/stick.png'

const POSITIONS = {
    HEAD_ORIGIN: {x: 200, y: 200},
    BODY_ORIGIN: {x: 200, y: 200},
    LEGS_ORIGIN: {x: 200, y: 200},
    ARMOR_ORIGIN: {x: 200, y: 200},
    SHIELD_ORIGIN: {x: 200, y: 200},

    HEAD_OFFSET: {x: 669, y: 62},
    BODY_OFFSET: {x: 605, y: 325},
    LEGS_OFFSET: {x: 664, y: 488},
    ARMOR_OFFSET: {x: 660, y: 325},
    SHIELD_OFFSET: {x: 520, y: 270}
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
        this.element = this.scene.add.image(this.origin.x, this.origin.y, resource).setOrigin(0).setScale(0.57);
        this.setTweenController();
    }

    setTweenController() {
        let tween = this.scene.tweens.add({
            targets: this.element,
            props: {
                x: { value: this.offset.x, duration: 1000, ease: 'Sine.linear' },
                y: { value: this.offset.y, duration: 1000, ease: 'Sine.linear' },
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
        this.load.image('head', head)
        this.load.image('body', body, { width: 200, height: 200 })
        this.load.image('legs', legs, { width: 200, height: 200 })
        this.load.image('armor', armor, { width: 200, height: 200 })
        this.load.image('shield', shield, { width: 200, height: 200 })
    }

    create() {
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.add.image(0, 0, 'background').setOrigin(0).setScale(0.57)

        // Add particles to head
        // headParticles = this.add.particles('red');
        // headParticlesEmitter = headParticles.createEmitter({
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: 'ADD',
        //     lifespan: 1000,
        //     y: 100
        // });

        // headParticlesEmitter.startFollow(head);
        // headParticlesEmitter.enabled = false

        this._setTransitions();
        this.nextTransition();

        // new GameController(this);
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
        this.transitions.push(new Transition(this, POSITIONS.HEAD_ORIGIN, POSITIONS.HEAD_OFFSET, 'head'));
        this.transitions.push(new Transition(this, POSITIONS.BODY_ORIGIN, POSITIONS.BODY_OFFSET, 'body'));
        this.transitions.push(new Transition(this, POSITIONS.LEGS_ORIGIN, POSITIONS.LEGS_OFFSET, 'legs'));
        this.transitions.push(new Transition(this, POSITIONS.ARMOR_ORIGIN, POSITIONS.ARMOR_OFFSET, 'armor'));
        this.transitions.push(new Transition(this, POSITIONS.SHIELD_ORIGIN, POSITIONS.SHIELD_OFFSET, 'shield'));
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
