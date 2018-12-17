import { Scene } from 'phaser'


export default class MenuScene extends Scene {
  constructor () {
    super({ key: 'MenuScene' })
  }

  create () {
    this.add.image(400, 300, 'sky')
  }

  update () {
  }
}
