import { Scene } from 'phaser'
import GameController from '@/recorder/GameController.js'


import background from '@/game/assets/bg_warrior.png'
import head from '@/game/assets/head.png'
import headSprite from '@/game/assets/head_sprite.png'
import body from '@/game/assets/body.png'
import legs from '@/game/assets/legs.png'
import armor from '@/game/assets/armor.png'
import shield from '@/game/assets/shield.png'
import shieldSprite from '@/game/assets/shield_sprite.png'
import stick from '@/game/assets/stick.png'

const POSITIONS = {
    HEAD_ORIGIN: {x: 200, y: 200},
    BODY_ORIGIN: {x: 200, y: 100},
    LEGS_ORIGIN: {x: 350, y: 150},
    ARMOR_ORIGIN: {x: 400, y: 300},
    SHIELD_ORIGIN: {x: 205, y: 320},

    HEAD_OFFSET: {x: 669, y: 62},
    BODY_OFFSET: {x: 605, y: 325},
    LEGS_OFFSET: {x: 664, y: 488},
    ARMOR_OFFSET: {x: 660, y: 325},
    SHIELD_OFFSET: {x: 520, y: 270}
}

let keySpace;
let headSpriteAnim;
let shieldSpriteAnim;
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
        console.log('pushing')
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

    constructor(scene, origin, offset, resource, depth) {
        this.scene = scene;
        this.origin = origin;
        this.offset = offset;
        this.element = this.scene.add.image(this.origin.x, this.origin.y, resource).setOrigin(0).setScale(0.57).setDepth(depth).setRotation(depth*5);
        this.setTweenController(resource);
    }

    setTweenController(resource) {
        let tween = this.scene.tweens.add({
            targets: this.element,
            props: {
                x: { value: this.offset.x, duration: 1400, ease: 'Power4' },
                y: { value: this.offset.y, duration: 800, ease: 'Power4' },
            },
            yoyo: false,
            repeat: 0,
            delay: 0,
            onUpdate: () => {
                switch (resource) {
                    case 'legs':
                        this.element.setDepth(1).setRotation(0)
                        break
                    case 'head':
                        this.element.setDepth(2).setRotation(0)
                        break
                    case 'body':
                        this.element.setDepth(3).setRotation(0)
                        break
                    case 'armor':
                        this.element.setDepth(4).setRotation(0)
                        break
                    case 'shield':
                        this.element.setDepth(5).setRotation(0)
                        break
                }
            },
            onComplete:  () => {
                if (resource === 'head') {
                    this.element.destroy(true)
                    headSpriteAnim = this.scene.add.sprite(POSITIONS.HEAD_OFFSET.x, POSITIONS.HEAD_OFFSET.y, 'headSprite')
                        .setOrigin(0,0)
                        .setScale(0.57)
                        .setDepth(2)
                } else if (resource === 'shield') {
                    this.element.destroy(true)
                    shieldSpriteAnim = this.scene.add.sprite(POSITIONS.SHIELD_OFFSET.x, POSITIONS.SHIELD_OFFSET.y, 'shieldSprite')
                        .setOrigin(0,0)
                        .setScale(0.57)
                        .setDepth(5)
                }
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
    patterns = [
      ['ara'],
      ['ere'],
      ['iri'],
      ['oro'],
      ['uru']
    ]
    pattern = null;

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

        this.load.spritesheet('headSprite', headSprite, { frameWidth: 363, frameHeight: 476 });
        this.load.spritesheet('shieldSprite', shieldSprite, { frameWidth: 401, frameHeight: 632 });

        this.gameController = new GameController(this);
    }

    create() {
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.add.image(0, 0, 'background').setOrigin(0).setScale(0.57)

        let configShield = {
            key: 'shieldAlive',
            frames: this.anims.generateFrameNumbers('shieldSprite', { frames: [0, 1, 2, 3] }),
            frameRate: 6,
            yoyo: false,
            repeat: 0,
        }

        this.anims.create(configShield)

        let configHead = {
            key: 'headAlive',
            frames: this.anims.generateFrameNumbers('headSprite', { frames: [0, 1, 2, 3] }),
            frameRate: 6,
            yoyo: false,
            repeat: 0
        }

        this.anims.create(configHead)

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
        this.transitions.push(new Transition(this, POSITIONS.HEAD_ORIGIN, POSITIONS.HEAD_OFFSET, 'head', 5));
        this.transitions.push(new Transition(this, POSITIONS.BODY_ORIGIN, POSITIONS.BODY_OFFSET, 'body', 4));
        this.transitions.push(new Transition(this, POSITIONS.LEGS_ORIGIN, POSITIONS.LEGS_OFFSET, 'legs', 3));
        this.transitions.push(new Transition(this, POSITIONS.ARMOR_ORIGIN, POSITIONS.ARMOR_OFFSET, 'armor', 2));
        this.transitions.push(new Transition(this, POSITIONS.SHIELD_ORIGIN, POSITIONS.SHIELD_OFFSET, 'shield', 1));
    }

    nextTransition() {
        console.log('next')
        if (this.transitions.length > 0) {
            this.transition = this.transitions.shift();
            this.pattern = this.patterns.shift();
            this.gameController.setPatterns(this.pattern);
        }
        else {

            shieldSpriteAnim.anims.load('shieldAlive')
            shieldSpriteAnim.anims.play('shieldAlive')

            headSpriteAnim.anims.load('headAlive')
            headSpriteAnim.anims.play('headAlive')

            console.log('game complete');
        }
    }
}
