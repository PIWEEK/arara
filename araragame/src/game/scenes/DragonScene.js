import { Scene } from 'phaser'
import dragon from '@/game/assets/dragon.png'
import fireballSprite from '@/game/assets/fireball.png'
import knightSprite from '@/game/assets/knight.png'

let knight;
let knightController;
let dragonController;
let keySpace;
class KnightController {
    shieldUp = false
    uncoverMovement = false
    sprite = null

    constructor(sprite) {
        this.shieldUp = false;
        this.sprite = sprite;
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
    speed = Phaser.Math.GetSpeed(600, 4);
    fireballs = [];

    constructor(scene) {
        this.scene = scene;
    }

    throwFireball(target) {
        let sprite = this.scene.physics.add.sprite(150, 200, 'fireball');
        sprite.anims.load('burn');
        sprite.anims.play('burn');
        this.fireballs.push(sprite)

        this.scene.physics.add.overlap(sprite, target, this.scene.hitKnight, null, this.scene);
    }


    moveFireballs(delta) {
        for (let fireball of this.fireballs) {
            fireball.x += this.speed * delta;
        }
    }

    destroyFireball(fireball) {
        let index = this.fireballs.indexOf(fireball);
        this.fireballs.splice(index, 1);
        fireball.destroy();
    }
}

export default class DragonScene extends Scene {
    fireballFactory = null;

    constructor() {
        super({ key: 'DragonScene' })
    }

    preload() {
        this.load.image('dragon', dragon)
        this.load.spritesheet('fireball', fireballSprite, { frameWidth: 188, frameHeight: 108 });
        this.load.spritesheet('knight', knightSprite, { frameWidth: 55, frameHeight: 64 })
    }

    create() {
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.add.image(0, 0, 'sky').setOrigin(0, 0)
        this.add.image(50, 200, 'dragon').setOrigin(0, 0)

        let fireballConfig = {
            key: 'burn',
            frames: this.anims.generateFrameNumbers('fireball'),
            frameRate: 6,
            yoyo: false,
            repeat: -1
        };

        let knightConfig = {
            key: 'guard',
            frames: this.anims.generateFrameNumbers('knight'),
            frameRate: 6,
            yoyo: false,
            repeat: 0,
        };

        this.anims.create(fireballConfig)
        this.anims.create(knightConfig)

        knight = this.physics.add.sprite(600, 200, 'knight')
        knight.anims.load('guard');
        knight.anims.setDelay(0);
        knightController = new KnightController(knight);
        this.fireballFactory = new FireballFactory(this);

        setInterval( () => {
            this.fireballFactory.throwFireball(knight);
        }, 2000)

    }

    update(time, delta) {
        this.fireballFactory.moveFireballs(delta)

        // Knight shield controller
        if (keySpace.isDown && !knightController.shieldUp) {
            knightController.cover()
        }

        if (!keySpace.isDown && knightController.shieldUp && !knightController.uncoverMovement) {
            knightController.uncover();
        }
    }

    hitKnight(fireball, knight) {
        if (knightController.shieldUp) {
            knightController.block()
            console.log('blocked!!!');
        } else {
            knightController.impacted()
            console.log('hit!!')
        }

        this.fireballFactory.destroyFireball(fireball);
    }
}
