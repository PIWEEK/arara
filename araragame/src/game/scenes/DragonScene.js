import { Scene } from 'phaser'
import background from '@/game/assets/fondo_acuarela.png'
import dragon from '@/game/assets/dragon.png'
import fireballSprite from '@/game/assets/fireball.png'
import knightSprite from '@/game/assets/knight-animation.png'

const STATES = {
    PAUSE: 'PAUSE',
    UNDERFIRE: 'UNDERFIRE',
    BURNED: 'BURNED',
}

let keySpace;
class KnightController {
    POSITION = { x: 900, y: 650 }
    scene = null;
    shieldUp = false;
    uncoverMovement = false;
    sprite = null;

    constructor(scene) {
        this.shieldUp = false;
        this.scene = scene;
        this._setAnimation();
        this.sprite = this.scene.physics.add.sprite(this.POSITION.x, this.POSITION.y, 'knight');
        this.sprite.anims.load('guard');
        this.sprite.anims.setDelay(0);
    }

    _setAnimation() {
        let config = {
            key: 'guard',
            frames: this.scene.anims.generateFrameNumbers('knight', { frames: [0, 1] }),
            frameRate: 6,
            yoyo: false,
            repeat: 0,
        };

        this.scene.anims.create(config);
    }

    cover() {
        this.shieldUp = true;
        this.sprite.anims.play('guard');
        this.sprite.anims.restart();
        console.log('cover');
    }

    uncover() {
        this.uncoverMovement = true;
        setTimeout(function () {
            this.sprite.anims.playReverse('guard');
            this.shieldUp = false;
            this.uncoverMovement = false;
        }.bind(this), 1000)
    }

    impacted() {
        this.sprite.setTint(0xff0000)

        setTimeout(function () {
            this.sprite.clearTint();
        }.bind(this), 1000)
    }

    block() {
        this.sprite.setTint(0x00ff00)

        setTimeout(function () {
            this.sprite.clearTint();
        }.bind(this), 1000)
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
            key: 'burn',
            frames: this.scene.anims.generateFrameNumbers('fireball'),
            frameRate: 6,
            yoyo: false,
            repeat: -1
        };

        this.scene.anims.create(fireballConfig);
    }

    throwFireball(target) {
        let sprite = this.scene.physics.add.sprite(150, 200, 'fireball');
        sprite.anims.load('burn');
        sprite.anims.play('burn');
        this.fireballs.push(sprite)

        this.scene.physics.moveToObject(sprite, target, this.speed);
        this.scene.physics.add.overlap(sprite, target, this.scene.hitKnight, null, this.scene);
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
}

export default class DragonScene extends Scene {
    state = '';
    fireballFactory = null;
    knightController = null;

    constructor() {
        super({ key: 'DragonScene' })
        this.state = STATES.UNDERFIRE;
    }

    preload() {
        this.load.image('background', background);
        this.load.image('dragon', dragon);
        this.load.spritesheet('fireball', fireballSprite, { frameWidth: 188, frameHeight: 108 });
        this.load.spritesheet('knight', knightSprite, { frameWidth: 273, frameHeight: 225 });
    }

    create() {
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.add.image(0, 0, 'background').setOrigin(0, 0)
        this.add.image(50, 200, 'dragon').setOrigin(0, 0)

        this.knightController = new KnightController(this);
        this.fireballFactory = new FireballFactory(this);

        setInterval(() => {
            if (this.state == STATES.UNDERFIRE) {
                this.fireballFactory.throwFireball(this.knightController.sprite);
            }
        }, 2000)

    }

    update(time, delta) {
        if (keySpace.isDown && !this.knightController.shieldUp) {
            this.knightController.cover()
        }

        if (!keySpace.isDown && this.knightController.shieldUp && !this.knightController.uncoverMovement) {
            this.knightController.uncover();
        }
    }

    hitKnight(fireball, knight) {
        if (this.knightController.shieldUp) {
            this.knightController.block()
        } else {
            this.knightController.impacted()
            this.state = STATES.BURNED;
            this.fireballFactory.destroyAll();

            setTimeout(() => {
                this.state = STATES.UNDERFIRE;
            }, 3000);
        }

        this.fireballFactory.destroyFireball(fireball);
    }
}
