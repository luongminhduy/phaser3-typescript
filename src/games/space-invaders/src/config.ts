import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { HUDScene } from './scenes/HudScene';
import { MenuScene } from './scenes/MenuScene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Space Invaders',
  url: 'https://github.com/digitsensitive/phaser3-typescript',
  version: '2.0',
  width: 224,
  height: 240,
  zoom: 3,
  type: Phaser.AUTO,
  parent: 'game',
  scene: [BootScene, MenuScene, GameScene, HUDScene],
  input: {
    keyboard: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  backgroundColor: '#f5cc69',
  render: { pixelArt: true, antialias: false }
};
