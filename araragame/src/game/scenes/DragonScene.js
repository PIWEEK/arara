import { Scene } from 'phaser'
import GameController from '@/recorder/GameController.js'

// assets
import background from '@/game/assets/background.png'
import fireballSprite from '@/game/assets/fireball.png'
import knightSprite from '@/game/assets/knight-animation.png'
import dragonSprite from '@/game/assets/dragon_sprite_gimp.png';
import hitboxSprite from '@/game/assets/hitbox.png'
import fireballFX from '@/game/assets/audio/fx/fireball.wav'
import shieldGuardFX from '@/game/assets/audio/fx/shieldguard.wav'

const STATES = {
    PAUSE: 'PAUSE',
    UNDERFIRE: 'UNDERFIRE',
    BURNED: 'BURNED',
    DONE: 'DONE',
}

const POSITIONS = {
    KNIGHT: { x: 800, y: 500 },
    EXPLOSION: { x: 800, y: 580 },
    HITBOX: { x: 825, y: 600 },
    DRAGON: { x: 50, y: 190 },
    FIREBALL: { x: 50 + 400, y: 190 + 190 },
}

const COVERTIME = 2000;
const FIREBALL_FREQUENCY = 6000;
const FIREBALL_SPEED = 200; // pixels/seconds
const FIREBALL_ROTATION = -0.706858;
const SUCCESS_BLOCKS = 5;
class KnightController {
    scene = null;
    shieldUp = false;
    uncoverMovement = false;
    sprite = null;
    hitbox = null;

    constructor(scene) {
        this.shieldUp = false;
        this.scene = scene;
        this._setAnimation();
        this.sprite = this.scene.physics.add.sprite(POSITIONS.KNIGHT.x, POSITIONS.KNIGHT.y, 'knight').setOrigin(0, 0);
        this.hitbox = this.scene.physics.add.sprite(POSITIONS.HITBOX.x, POSITIONS.HITBOX.y, 'hitbox').setOrigin(0, 0);
        this.hitbox.setAlpha(0);
        this.restart();
    }

    _setAnimation() {
        let configGuard = {
            key: 'guard',
            frames: this.scene.anims.generateFrameNumbers('knight', { frames: [0, 1] }),
            frameRate: 6,
            yoyo: false,
            repeat: 0,
            delay: 0,
        };

        let configBurn = {
            key: 'burn',
            frames: this.scene.anims.generateFrameNumbers('knight', { frames: [2, 3, 4] }),
            frameRate: 6,
            yoyo: false,
            repeat: 0,
            delay: 0,
        };

        this.scene.anims.create(configGuard);
        this.scene.anims.create(configBurn);
    }

    cover() {
        this.shieldUp = true;
        this.sprite.anims.play('guard');
        this.uncover();
    }

    uncover() {
        this.uncoverMovement = true;
        setTimeout(() => {
            this.restart();
            this.uncoverMovement = false;
        }, COVERTIME)
    }

    impacted() {
        this.sprite.anims.play('burn');

        setTimeout(() => {
            this.restart();
        }, 3000)
    }

    block() {
        //this.scene.sound.play('shieldGuardFX');
    }

    restart() {
        this.sprite.anims.load('guard');
        this.shieldUp = false;
    }
}

class FireballFactory {
    scene = null;
    fireballs = [];
    explosion = null;
    target = null;

    constructor(scene, target) {
        this.scene = scene;
        this.target = target;
        this._setAnimation();
    }

    _setAnimation() {
        let fireballConfig = {
            key: 'flame',
            frames: this.scene.anims.generateFrameNumbers('fireball', { frames: [0, 1, 2, 3, 4, 5] }),
            frameRate: 6,
            yoyo: false,
            repeat: 0
        };

        let explodeConfig = {
            key: 'explode',
            frames: this.scene.anims.generateFrameNumbers('fireball', { frames: [6] }),
            frameRate: 6,
            yoyo: false,
            repeat: 0
        };


        this.scene.anims.create(fireballConfig);
        this.scene.anims.create(explodeConfig);
    }

    throwFireball() {
        let sprite = this.scene.physics.add.sprite(POSITIONS.FIREBALL.x, POSITIONS.FIREBALL.y, 'fireball');
        sprite.setRotation(FIREBALL_ROTATION);
        sprite.anims.load('flame');
        sprite.anims.play('flame');
        this.fireballs.push(sprite)

        //this.scene.sound.play('fireballFX');
        this.scene.physics.moveToObject(sprite, this.target, FIREBALL_SPEED);
        this.scene.physics.add.overlap(sprite, this.target, this.scene.fireballCollision, null, this.scene);
    }

    destroyFireball(fireball) {
        let index = this.fireballs.indexOf(fireball);
        this.fireballs.splice(index, 1);
        fireball.destroy();
    }

    makeExplosion() {
        this.explosion = this.scene.physics.add.sprite(POSITIONS.EXPLOSION.x, POSITIONS.EXPLOSION.y, 'fireball');
        this.explosion.anims.load('explode');

        this.explosion.on('animationcomplete', () => {
            this.explosion.destroy();
        }, this.scene);

        this.explosion.anims.play('explode');
    }

    destroyAll() {
        for (let fireball of this.fireballs) {
            fireball.destroy();
        }
        this.fireballs = [];
    }

    restart() {
        this.destroyAll();
    }
}

class DragonController {
    scene = null;
    sprite = null;
    fireballFactory = null;
    onMovement = false;

    constructor(scene, fireballFactory) {
        this.scene = scene;
        this.fireballFactory = fireballFactory;
        this._setAnimation();
        this.sprite = this.scene.physics.add.sprite(POSITIONS.DRAGON.x, POSITIONS.DRAGON.y, 'dragon').setFrame(1).setOrigin(0, 0);
    }

    _setAnimation() {
        let config = {
            key: 'throw',
            frames: this.scene.anims.generateFrameNumbers('dragon', { frames: [1, 0, 1, 2] }),
            frameRate: 4,
            yoyo: false,
            repeat: 0,
            delay: 0,
        };

        let configBack = {
            key: 'back',
            frames: this.scene.anims.generateFrameNumbers('dragon', { frames: [2, 1] }),
            frameRate: 4,
            yoyo: false,
            repeat: 0,
            delay: 0,
        };

        this.scene.anims.create(config);
        this.scene.anims.create(configBack);
    }

    throw() {
        this.onMovement = true;
        this.sprite.anims.load('throw');

        this.sprite.on('animationcomplete', () => {
            if (this.onMovement) {
                this.fireballFactory.throwFireball();
                this.onMovement = false;
                this.sprite.anims.play('back');
            }

        }, this.scene);

        this.sprite.anims.play('throw');
    }


}

export default class DragonScene extends Scene {
    state = '';
    fireballFactory = null;
    knightController = null;
    dragonController = null;
    blockCounter = 0;
    textBox = null;

    controls = {
        keySpace: null,
        R: null
    }

    constructor() {
        super({ key: 'DragonScene' })
        this.state = STATES.PAUSE;
    }

    preload() {
        this.load.image('background', background);
        this.load.image('hitbox', hitboxSprite);
        this.load.spritesheet('fireball', fireballSprite, { frameWidth: 165, frameHeight: 335 });
        this.load.spritesheet('knight', knightSprite, { frameWidth: 273, frameHeight: 225 });
        this.load.spritesheet('dragon', dragonSprite, { frameWidth: 486, frameHeight: 533 });
        this.load.audio('fireballFX', [fireballFX]);
        this.load.audio('shieldGuardFX', [shieldGuardFX]);
        this.gameController = new GameController(this);
    }

    create() {
        this.controls.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.controls.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        new GameController(this);

        this.add.image(0, 0, 'background').setOrigin(0);
        this.textBox = this.add.text(100, 100, '', { fontSize: '48px', fill: '#000' });
        this.knightController = new KnightController(this);
        this.fireballFactory = new FireballFactory(this, this.knightController.hitbox);
        this.dragonController = new DragonController(this, this.fireballFactory);

        this.gameController.setPatterns(['ra', 're', 'rá', 'ré']);

        this.restartGame();

        setInterval(() => {
            if (this.state == STATES.UNDERFIRE) {
                this.dragonController.throw();
            }
        }, FIREBALL_FREQUENCY);

    }

    update(time, delta) {

        if (this.state == STATES.UNDERFIRE) {
            if (this.controls.keySpace.isDown && !this.knightController.shieldUp) {
                this.knightController.cover()
            }
        }

        if (this.state == STATES.DONE) {
            if (this.controls.R.isDown) {
                this.restartGame();
            }
        }
    }

    fireballCollision(fireball, knight) {
        if (this.knightController.shieldUp) {
            this.knightController.block();
            this.incrementBlockCount();
        } else {
            this.state = STATES.BURNED;
            this.knightController.impacted();
            this.fireballFactory.destroyAll();
            this.resetBlockCOunt();

            setTimeout(() => {
                this.restartGame();
            }, 3000);
        }
        this.fireballFactory.makeExplosion();
        this.fireballFactory.destroyFireball(fireball);

        if (this.blockCounter == SUCCESS_BLOCKS) {
            this.state = STATES.DONE;
            this.textBox.setText('WIN!!');
        }
    }

    restartGame() {
        this.state = STATES.UNDERFIRE;
        this.blockCounter = 0;
        this.fireballFactory.restart();
        this.knightController.restart();
    }

    incrementBlockCount() {
        this.blockCounter += 1;
        this.textBox.setText(`${this.blockCounter} paradas`);
    }

    resetBlockCOunt() {
        this.blockCounter = 0;
        this.textBox.setText('0 paradas');
    }

    action() {
        if (this.state == STATES.UNDERFIRE) {
            if (!this.knightController.shieldUp) {
                this.knightController.cover();
            }
        }
    }
}
