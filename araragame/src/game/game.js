import Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import SplashScene from './scenes/SplashScene'
import MenuScene from './scenes/MenuScene'
import KnightScene from './scenes/KnightScene'
import DragonScene from './scenes/DragonScene'


function launch() {
  new Phaser.Game({
    type: Phaser.AUTO,
    scale: {
      scale: 'SHOW_ALL',
      orientation: 'LANDSCAPE'
    },
    transparent: true,
    parent: 'game-container',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: [BootScene, SplashScene, MenuScene, KnightScene, DragonScene]
  })
}

export default launch
export { launch }
