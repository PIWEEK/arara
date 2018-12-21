import { Scene } from 'phaser'
import GameController from '@/recorder/GameController.js'


import background from '@/game/assets/background.png'
import shape from '@/game/assets/knight_scene/shape.png'
import sparks from '@/game/assets/knight_scene/sparks.png'
import head from '@/game/assets/knight_scene/helmet.png'
import face_smile from '@/game/assets/knight_scene/face_smile.png'
import face_sleep from '@/game/assets/knight_scene/face_sleep.png'
import body from '@/game/assets/knight_scene/body.png'
import legs from '@/game/assets/knight_scene/legs.png'
import armor from '@/game/assets/knight_scene/armor.png'
import shield from '@/game/assets/knight_scene/shield.png'
import shield_blue from '@/game/assets/knight_scene/shield_blue.png'
import stick from '@/game/assets/knight_scene/stick.png'
import flaresImg from '@/game/assets/particles/flares.png'
import flaresJSON from '@/game/assets/particles/flares.json'

import arara from '@/game/assets/knight_scene/arara.png'
import erere from '@/game/assets/knight_scene/erere.png'
import iriri from '@/game/assets/knight_scene/iriri.png'
import ororo from '@/game/assets/knight_scene/ororo.png'
import ururu from '@/game/assets/knight_scene/ururu.png'


const POSITIONS = {
    HEAD_ORIGIN: { x: 200, y: 300 },
    BODY_ORIGIN: { x: 200, y: 350 },
    LEGS_ORIGIN: { x: 350, y: 350 },
    ARMOR_ORIGIN: { x: 400, y: 400 },
    SHIELD_ORIGIN: { x: 205, y: 470 },

    HEAD_OFFSET: { x: 700, y: 200 },
    BODY_OFFSET: { x: 650, y: 405 },
    LEGS_OFFSET: { x: 695, y: 530 },
    ARMOR_OFFSET: { x: 695, y: 405 },
    SHIELD_OFFSET: { x: 570, y: 360 },

    SHAPE: { x: 650, y: 200 },
    SPARKS: { x: 520, y: 195 },
}

let keySpace;
let N;
let headSpriteAnim;
let shieldSpriteAnim;
let wandArea;
let wandParticles;
let wandEmitter;

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
    spellTexture = null;

    constructor(scene, origin, offset, resource, depth, spellTexture) {
        this.scene = scene;
        this.origin = origin;
        this.offset = offset;
        this.element = this.scene.add.image(this.origin.x, this.origin.y, resource).setOrigin(0).setDepth(depth).setScale(0.75).setRotation(depth * 5);
        this.spellTexture = spellTexture;
        this.setTweenController(resource);
    }

    setTweenController(resource) {
        let tween = this.scene.tweens.add({
            targets: this.element,
            props: {
                x: { value: this.offset.x, duration: 3000 },
                y: { value: this.offset.y, duration: 3000 },
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
                        this.element.setDepth(3).setRotation(0)
                        break
                    case 'body':
                        this.element.setDepth(2).setRotation(0)
                        break
                    case 'armor':
                        this.element.setDepth(4).setRotation(0)
                        break
                    case 'shield':
                        this.element.setDepth(5).setRotation(0)
                        break
                }
            },
            onComplete: () => {
                if (resource === 'head') {
                    this.element.destroy(true)
                    headSpriteAnim = this.scene.add.sprite(POSITIONS.HEAD_OFFSET.x, POSITIONS.HEAD_OFFSET.y, 'head')
                        .setOrigin(0, 0)
                        .setScale(0.75)
                        .setDepth(2)
                } else if (resource === 'shield') {
                    this.element.destroy(true)
                    shieldSpriteAnim = this.scene.add.sprite(POSITIONS.SHIELD_OFFSET.x, POSITIONS.SHIELD_OFFSET.y, 'shield')
                        .setOrigin(0, 0)
                        .setScale(0.75)
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
    spell = null;
    patterns = [
        ['ara'],
        ['ere'],
        ['iri'],
        ['oro'],
        ['uru']
    ]
    pattern = null;
    sparksImage = null;
    power = 0;

    constructor() {
        super({ key: 'KnightScene' })
    }

    preload() {
        this.load.image('background', background);
        this.load.image('shape', shape);
        this.load.image('head', head);
        this.load.image('face_smile', face_smile);
        this.load.image('face_sleep', face_sleep);
        this.load.image('body', body);
        this.load.image('legs', legs);
        this.load.image('armor', armor);
        this.load.image('shield', shield);
        this.load.image('shield_blue', shield_blue);
        this.load.image('sparks', sparks);
        this.load.image('stick', stick);
        this.load.atlas('flares', flaresImg, flaresJSON)

        this.load.image('arara', arara);
        this.load.image('erere', erere);
        this.load.image('iriri', iriri);
        this.load.image('ororo', ororo);
        this.load.image('ururu', ururu);

        delete this.gameController
        this.gameController = new GameController(this);
    }

    create() {
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        N = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);

        this.add.image(0, 0, 'background').setOrigin(0);
        this.add.image(POSITIONS.SHAPE.x, POSITIONS.SHAPE.y, 'shape').setOrigin(0).setScale(0.75);
        this.add.image(200, 600, 'stick').setOrigin(0);
        this.spell = this.add.image(512, 100, 'arara').setOrigin(0.5, 0.5)

        this.sparksImage = this.add.image(POSITIONS.SPARKS.x, POSITIONS.SPARKS.y, 'sparks')
            .setOrigin(0)
            .setScale(0.75)
            .setVisible(false);

        let configShield = {
            key: 'shieldAlive',
            frames: [
                { key: 'shield' },
                { key: 'shield_blue' },
            ],
            frameRate: 6,
            yoyo: false,
            repeat: 0,
        }

        this.anims.create(configShield)

        let configHead = {
            key: 'headAlive',
            frames: [
                { key: 'head' },
                { key: 'face_sleep' },
                { key: 'face_smile' },
            ],
            frameRate: 6,
            yoyo: false,
            repeat: 0
        }

        this.anims.create(configHead)

        // Add particles to wand
        wandArea = this.add.rectangle(215, 610, 60, 60)
            .setOrigin(0, 0);

        let origin = wandArea.getTopLeft();
        let wandSource = {
            getRandomPoint: (vec) => {
                do {
                    var x = Phaser.Math.Between(0, wandArea.width);
                    var y = Phaser.Math.Between(0, wandArea.height);
                    var pixel = 50;
                } while (pixel.alpha < 255);

                return vec.setTo(x + origin.x, y + origin.y);
            }
        };

        wandParticles = this.add.particles('flares');
        wandEmitter = wandParticles.createEmitter({
            x: 0,
            y: 0,
            lifespan: 500,
            gravityY: 10,
            scale: { start: 0, end: 0.25, ease: 'Quad.easeOut' },
            alpha: { start: 1, end: 0, ease: 'Quad.easeIn' },
            blendMode: 'ADD',
            emitZone: { type: 'random', source: wandSource },
            on: false,
        });

        this._setTransitions();
        this.nextTransition();
    }

    update() {
        if (keySpace.isDown) {
            this.transition.controller.pushing();
        }

        if (N.isDown) {
            this.gameController.destroyRecorder();
            this.scene.start('DragonScene');
        }

        if (this.power > 0) {
            this.transition.controller.tween.play();
            wandEmitter.on = true;
            this.power -= 1;

            if (this.power < 0) {
                this.power = 0;
            }

            if (this.power == 0) {
                wandEmitter.on = false;
                this.transition.controller.tween.pause();
            }
        }
    }

    action(counter) {
        console.log(`\n POWER +${(50 * counter)}\n`);
        this.power += (50 * counter)
    }

    _setTransitions() {
        this.transitions.push(new Transition(this, POSITIONS.HEAD_ORIGIN, POSITIONS.HEAD_OFFSET, 'head', 5, 'arara'));
        this.transitions.push(new Transition(this, POSITIONS.BODY_ORIGIN, POSITIONS.BODY_OFFSET, 'body', 4, 'erere'));
        this.transitions.push(new Transition(this, POSITIONS.LEGS_ORIGIN, POSITIONS.LEGS_OFFSET, 'legs', 3, 'iriri'));
        this.transitions.push(new Transition(this, POSITIONS.ARMOR_ORIGIN, POSITIONS.ARMOR_OFFSET, 'armor', 2, 'ororo'));
        this.transitions.push(new Transition(this, POSITIONS.SHIELD_ORIGIN, POSITIONS.SHIELD_OFFSET, 'shield', 1, 'ururu'));
    }

    nextTransition() {
        if (this.transitions.length > 0) {
            this.power = 0;
            wandEmitter.on = false;
            this.transition = this.transitions.shift();
            this.pattern = this.patterns.shift();
            this.spell.setTexture(this.transition.spellTexture);
            this.gameController.setPatterns(this.pattern);
        }
        else {

            shieldSpriteAnim.anims.load('shieldAlive')
            shieldSpriteAnim.anims.play('shieldAlive')

            headSpriteAnim.anims.load('headAlive')

            headSpriteAnim.on('animationcomplete', () => {
                this.sparksImage.setVisible(true);
            }, this);

            headSpriteAnim.anims.play('headAlive')

            setTimeout(() => {
                this.gameController.destroyRecorder();
                this.scene.start('DragonScene');
            }, 3000);

            console.log('game complete');
        }
    }
}
