import { Scene } from 'phaser'

let fireball;
let fireballSpeed;
let knight;
let knightController;
let keySpace;
class KnightController {
    shieldUp = false
    sprite = null

    constructor(sprite) {
        this.shieldUp = false;
        this.sprite = sprite;
    }

    cover() {
        this.shieldUp = true;
    }

    uncover() {
         setTimeout(function() {
            this.shieldUp = false;
        }.bind(this), 2000)
    }

    impacted() {
        this.sprite.setTint(0xff0000)

        setTimeout(function () {
            this.sprite.clearTint();
        }.bind(this), 1000)
    }
}

export default class DragonScene extends Scene {
    constructor() {
        super({ key: 'DragonScene' })
    }

    create() {
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.add.image(0, 0, 'sky').setOrigin(0, 0)
        this.add.image(50, 200, 'dragon').setOrigin(0, 0)
        fireballSpeed = Phaser.Math.GetSpeed(600, 8)
        knight = this.physics.add.sprite(600, 200, 'knight')
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
        if (keySpace.isDown) {
            knightController.cover()
        }

        if (keySpace.isUp) {
            knightController.uncover();
        }
    }

    createNewFireBall() {
        fireball = this.physics.add.sprite(150, 200, 'fireball')
        this.physics.add.overlap(fireball, knight, this.hitKnight, null, this);

    }

    hitKnight(fireball, knight) {
        if (knightController.shieldUp) {
            console.log('blocked!!!');
        } else {
            knightController.impacted(knight)
            console.log('hit!!')
        }

        fireball.destroy();
        this.createNewFireBall();
    }
}
