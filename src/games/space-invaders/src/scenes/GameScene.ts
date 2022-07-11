import { Enemy } from '../objects/Enemy';
import { Player } from '../objects/Player';
import { Bullet } from '../objects/Bullet';

export class GameScene extends Phaser.Scene {
  private enemies: Phaser.GameObjects.Group;
  private player: Player;
  private particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(): void {
    this.enemies = this.add.group({ runChildUpdate: true });
    
  }

  create(): void {
    // create game objects
    this.particles = this.add.particles('smoke');
    this.player = new Player({
      scene: this,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height - 40,
      texture: 'player'
    });

    // if you want to make it random:
    // let enemyTypes = ["octopus", "crab", "squid"];
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 10; x++) {
        let type;
        if (y === 0) {
          type = 'squid';
        } else if (y === 1 || y === 2) {
          type = 'crab';
        } else {
          type = 'octopus';
        }
        // if you want to make it random:
        // let type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        this.enemies.add(
          new Enemy({
            scene: this,
            x: 20 + x * 15,
            y: 50 + y * 15,
            texture: type
          })
        );
      }
    }
  }

  update(): void {
    if (this.player.active) {
      this.player.update();

      this.enemies.children.each((enemy: Enemy) => {
        enemy.update();
        if (enemy.getBullets().getLength() > 0) {
          this.physics.overlap(
            enemy.getBullets(),
            this.player,
            this.bulletHitPlayer,
            null,
            this
          );
        }
      }, this);

      this.checkCollisions();
    }

    if (this.registry.get('lives') < 0 || this.enemies.getLength() === 0) {
      this.scene.start('MenuScene');
      this.scene.stop('HUDScene');
    }
  }

  private checkCollisions(): void {
    this.physics.overlap(
      this.player.getBullets(),
      this.enemies,
      this.bulletHitEnemy,
      null,
      this
    );
  }

  private bulletHitEnemy(bullet: Bullet, enemy: Enemy): void {
    enemy.setDepth(-1);
    this.emitter = this.particles.createEmitter({
      x: enemy.x,
      y: enemy.y,
      speed: { min: -200, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.2, end: 0.4 },
      blendMode: 'SCREEN',
      lifespan: 100,
      maxParticles: 5
    });
    this.time.addEvent({
      delay: 200,
      callback: () => {this.emitter.stop()}
    });
    bullet.destroy();
    enemy.gotHurt();
  }

  private bulletHitPlayer(bullet: Bullet, player: Player): void {
    bullet.destroy();
    player.gotHurt();
  }
}
