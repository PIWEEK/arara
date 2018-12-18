import Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import SplashScene from './scenes/SplashScene'
import MenuScene from './scenes/MenuScene'
import KnightScene from './scenes/KnightScene'


function launch() {
  new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: [BootScene, SplashScene, MenuScene, KnightScene]
  })
}

export default launch
export { launch }
