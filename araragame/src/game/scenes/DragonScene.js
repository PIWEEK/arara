import { Scene } from 'phaser'
import fireballSprite from '@/game/assets/fireball.png'
import knightSprite from '@/game/assets/knight.png'

let fireball;
let fireballSpeed;
let knight;
let knightController;
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

export default class DragonScene extends Scene {
    constructor() {
        super({ key: 'DragonScene' })
    }

    preload() {
        this.load.spritesheet('fireball', fireballSprite, { frameWidth: 188, frameHeight: 108 });
        this.load.spritesheet('knight', knightSprite, { frameWidth: 55, frameHeight: 64 })
    }

    create() {
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.image(0, 0, 'sky').setOrigin(0, 0)
        this.add.image(50, 200, 'dragon').setOrigin(0, 0)
        fireballSpeed = Phaser.Math.GetSpeed(600, 4)

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
        knightController = new KnightController(knight)
        this.createNewFireBall()
    }

    update(time, delta) {
        // Fireball speed controller
        fireball.x += fireballSpeed * delta
        if (fireball.x > 800) {
            fireball.destroy();
            this.createNewFireBall()
        }

        // Knight shield controller
        if (keySpace.isDown && !knightController.shieldUp) {
            knightController.cover()
        }

        if (!keySpace.isDown && knightController.shieldUp && !knightController.uncoverMovement) {
            console.log('lauch uncover')
            knightController.uncover();
        }
    }

    createNewFireBall() {
        fireball = this.physics.add.sprite(150, 200, 'fireball');
        fireball.anims.load('burn');
        fireball.anims.play('burn');
        this.physics.add.overlap(fireball, knight, this.hitKnight, null, this);
    }

    hitKnight(fireball, knight) {
        if (knightController.shieldUp) {
            knightController.block()
            console.log('blocked!!!');
        } else {
            knightController.impacted()
            console.log('hit!!')
        }

        fireball.destroy();
        this.createNewFireBall();
    }
}
