import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { MenuScene } from './scenes/MenuScene';
import { OverScene } from './scenes/OverScene';
import { PauseScene } from './scenes/PauseScene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Tank',
  url: 'https://github.com/digitsensitive/phaser3-typescript',
  version: '2.0',
  width: 1600,
  height: 1200,
  zoom: 0.6,
  type: Phaser.AUTO,
  parent: 'game',
  scene: [BootScene, PauseScene, MenuScene, GameScene, OverScene],
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
  backgroundColor: '#000000',
  render: { pixelArt: false, antialias: true }
};
