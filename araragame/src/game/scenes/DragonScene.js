import { Scene } from 'phaser'
import GameController from '@/recorder/GameController.js'

// assets
import background from '@/game/assets/game-background.png'
import dragon from '@/game/assets/dragon.png'
import fireballSprite from '@/game/assets/fireball.png'
import knightSprite from '@/game/assets/knight-animation.png'
import hitboxSprite from '@/game/assets/hitbox.png'
import fireballFX from '@/game/assets/audio/fx/fireball.wav'
import shieldGuardFX from '@/game/assets/audio/fx/shieldguard.wav'

const STATES = {
    PAUSE: 'PAUSE',
    UNDERFIRE: 'UNDERFIRE',
    BURNED: 'BURNED',
}

const POSITIONS = {
    KNIGHT: { x: 800, y: 500 },
    HITBOX: { x: 900, y: 600 },
    FIREBALL: { x: 150, y: 200 },
    DRAGON: { x: 50, y: 200 }
}

const COVERTIME = 1500;

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
        this.sprite = this.scene.physics.add.sprite(POSITIONS.KNIGHT.x, POSITIONS.KNIGHT.y, 'knight').setOrigin(0,0);
        this.hitbox = this.scene.physics.add.sprite(POSITIONS.HITBOX.x, POSITIONS.HITBOX.y, 'hitbox').setOrigin(0,0);
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
    speed = 200 // pixes/second

    constructor(scene) {
        this.scene = scene;
        this._setAnimation();
    }

    _setAnimation() {
        let fireballConfig = {
            key: 'flame',
            frames: this.scene.anims.generateFrameNumbers('fireball'),
            frameRate: 6,
            yoyo: false,
            repeat: -1
        };

        this.scene.anims.create(fireballConfig);
    }

    throwFireball(target) {
        let sprite = this.scene.physics.add.sprite(POSITIONS.FIREBALL.x, POSITIONS.FIREBALL.y, 'fireball');
        sprite.anims.load('flame');
        sprite.anims.play('flame');
        this.fireballs.push(sprite)

        //this.scene.sound.play('fireballFX');
        this.scene.physics.moveToObject(sprite, target, this.speed);
        this.scene.physics.add.overlap(sprite, target, this.scene.fireballCollision, null, this.scene);
    }

    destroyFireball(fireball) {
        let index = this.fireballs.indexOf(fireball);
        this.fireballs.splice(index, 1);
        fireball.destroy();
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

export default class DragonScene extends Scene {
    state = '';
    fireballFactory = null;
    knightController = null;
    controls = {
        keySpace: null
    }
    gameController = null

    constructor() {
        super({ key: 'DragonScene' })
        this.state = STATES.PAUSE;
    }

    preload() {
        this.load.image('background', background);
        this.load.image('dragon', dragon);
        this.load.image('hitbox', hitboxSprite);
        this.load.spritesheet('fireball', fireballSprite, { frameWidth: 188, frameHeight: 108 });
        this.load.spritesheet('knight', knightSprite, { frameWidth: 273, frameHeight: 225 });
        this.load.audio('fireballFX', [fireballFX]);
        this.load.audio('shieldGuardFX', [shieldGuardFX]);
        this.gameController = new GameController(this);
    }

    create() {
        this.controls.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.image(POSITIONS.DRAGON.x, POSITIONS.DRAGON.y, 'dragon').setOrigin(0, 0);
        this.knightController = new KnightController(this);
        this.fireballFactory = new FireballFactory(this);

        this.gameController.setPatterns(['ra', 're', 'rá', 'ré']);

        this.restartGame();

        setInterval(() => {
            if (this.state == STATES.UNDERFIRE) {
                this.fireballFactory.throwFireball(this.knightController.hitbox);
            }
        }, 2000)

    }

    update(time, delta) {

        // input controllers
        if (this.state == STATES.UNDERFIRE) {
            if (this.controls.keySpace.isDown && !this.knightController.shieldUp) {
                this.knightController.cover()
            }

            /*if (!this.controls.keySpace.isDown && this.knightController.shieldUp && !this.knightController.uncoverMovement) {
                this.knightController.uncover();
            }*/
        }
    }

    fireballCollision(fireball, knight) {
        if (this.knightController.shieldUp) {
            this.knightController.block();
        } else {
            this.knightController.impacted();
            this.fireballFactory.destroyAll();
            this.state = STATES.BURNED;

            setTimeout(() => {
                this.restartGame();
            }, 3000);
        }

        this.fireballFactory.destroyFireball(fireball);
    }

    restartGame() {
        this.state = STATES.UNDERFIRE;
        this.fireballFactory.restart();
        this.knightController.restart();
    }

    action() {
        if (this.state == STATES.UNDERFIRE) {
            if (!this.knightController.shieldUp) {
                this.knightController.cover();
            }
        }
    }
}
