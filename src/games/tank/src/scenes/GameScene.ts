import { Player } from '../objects/Player';
import { Enemy } from '../objects/Enemy';
import { Obstacle } from '../objects/obstacles/Obstacles';
import { Bullet } from '../objects/Bullet';
import { Button } from '../objects/Button';

export class GameScene extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private layer: Phaser.Tilemaps.TilemapLayer;
  private player: Player;
  private enemies: Phaser.GameObjects.Group;
  private obstacles: Phaser.GameObjects.Group;
  private shootingParticles: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private shootingEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private hitParticles: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private hitEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private shootingSound: Phaser.Sound.BaseSound;
  private burningSound: Phaser.Sound.BaseSound;
  private warSound: Phaser.Sound.BaseSound;
  private textScore: Phaser.GameObjects.BitmapText;
  private scoreContainer: Phaser.GameObjects.Container;
  screenRec: Phaser.GameObjects.Rectangle;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(): void {
    this.registry.set('score', 0);
  }
  
  create(): void {
    this.addSound();
    this.addRectangle();
    // create tilemap from tiled JSON
    this.drawMap();
    this.convertObjects();

    // collider layer and obstacles
    this.addCollider();

    this.cameras.main.startFollow(this.player);
    //shooting effect
    this.addParticles();
    this.addMenuButton();
    this.addScoreButton();
  }

  update(): void {
    this.player.update();
    if (this.screenRec && !this.scene.isPaused('GameScene')) this.screenRec.setAlpha(0);
    if (!this.player.active) {
      this.sound.stopAll();
    }
    if (this.player.isShooting && this.shootingSound) {
        this.shootingSound.play();
        this.player.isShooting = false;
    }

    this.enemies.children.each((enemy: Enemy) => {
      enemy.update();
      if (this.player.active && enemy.active) {
        var angle = Phaser.Math.Angle.Between(
          enemy.body.x,
          enemy.body.y,
          this.player.body.x,
          this.player.body.y
        );

        enemy.getBarrel().angle =
          (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
      }
    }, this);
  }

  private drawMap() {
    this.map = this.make.tilemap({ key: 'levelMap' });

    this.tileset = this.map.addTilesetImage('tiles');
    this.layer = this.map.createLayer('tileLayer', this.tileset, 0, 0);
    this.layer.setCollisionByProperty({ collide: true });

    this.obstacles = this.add.group({
      /*classType: Obstacle,*/
      runChildUpdate: true
    });

    this.enemies = this.add.group({
      /*classType: Enemy*/
    });
  }

  private addParticles() {
    this.shootingParticles = this.add.particles('smoke');

    this.shootingEmitter = this.shootingParticles.createEmitter({
        alpha: { start: 1, end: 0 },
        scale: { start: 0.5, end: 2.5 },
        tint: { start: 0xff945e, end: 0xff945e },
        speed: 20,
        accelerationY: -300,
        angle: { min: -85, max: -95 },
        rotate: { min: -180, max: 180 },
        lifespan: { min: 400, max: 500 },
        blendMode: 'ADD',
        frequency: 60,
        //maxParticles: 10,
        x: -100,
        y: -100,
        on: false
    });
    //destroying effect
    this.hitParticles = this.add.particles('blue');
    this.hitEmitter = this.hitParticles.createEmitter({
      x: 400,
      y: 300,
      speed: { min: -800, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'SCREEN',
      //active: false,
      lifespan: 600,
      gravityY: 800,
      on: false
    });
  }

  private addCollider() {
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.collider(this.player, this.obstacles);

    // collider for bullets
    
    this.physics.add.collider(
      this.player.getBullets(),
      this.layer,
      this.bulletHitLayer,
      null,
      this
    );

    this.physics.add.collider(
      this.player.getBullets(),
      this.obstacles,
      this.bulletHitObstacles,
      null,
      this
    );

    this.enemies.children.each((enemy: Enemy) => {
      this.physics.add.overlap(
        this.player.getBullets(),
        enemy,
        this.playerBulletHitEnemy,
        null,
        this
      );
      this.physics.add.overlap(
        enemy.getBullets(),
        this.player,
        this.enemyBulletHitPlayer,
        null
      );

      this.physics.add.collider(
        enemy.getBullets(),
        this.obstacles,
        this.bulletHitObstacles,
        null
      );
      this.physics.add.collider(
        enemy.getBullets(),
        this.layer,
        this.bulletHitLayer,
        null
      );
    }, this);
  }

  private addSound() {
    this.shootingSound = this.sound.add('shooting');
    this.burningSound = this.sound.add('burning');
    this.warSound = this.sound.add('war');
    this.warSound.play();
  }
  private addRectangle() {
    const width = this.sys.canvas.width*2;
    const height = this.sys.canvas.height*2;
    this.screenRec = this.add.rectangle(0, 0, width, height, 0x000000)
      .setAlpha(0)
      .setDepth(5000)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0);
  }

  private addMenuButton() {
    let button = new Button(200, 100, this, 'Menu');
    let menuButton = button.create(this);
    button.setInteract();
    button.container.on('pointerdown', () => {
      this.screenRec.setAlpha(0.4);
      this.scene.pause().launch('PauseScene');
    })
  }

  private addScoreButton() {
    this.textScore = this.add.bitmapText(
      //this.sys.canvas.width / 2 - 120,
      //200,
      0,
      0,
      'mainFont',
      `Score  ${this.registry.get('score')}`,
      50
    ).setOrigin(0.5, 0.5);
    this.textScore.setDepth(200);
    let button = this.add.image(0, 0, 'buttonNew');
    this.scoreContainer = this.add.container(this.sys.canvas.width - 200, 100, [button, this.textScore]).setScrollFactor(0);
    this.scoreContainer.setDepth(1000);
    this.scoreContainer.setInteractive();
    this.events.on('scoreChanges', this.updateScore, this);
  }

  private updateScore() {
    this.textScore.setText(`Score ${this.registry.get('score')}`);
  }

  private convertObjects(): void {
    // find the object layer in the tilemap named 'objects'
    const objects = this.map.getObjectLayer('objects').objects as any[];

    objects.forEach((object) => {
      if (object.type === 'player') {
        this.player = new Player({
          scene: this,
          x: object.x,
          y: object.y,
          texture: 'tankBlue'
        });
      } else if (object.type === 'enemy') {
        let enemy = new Enemy({
          scene: this,
          x: object.x,
          y: object.y,
          texture: 'tankRed'
        });

        this.enemies.add(enemy);
      } else {
        let obstacle = new Obstacle({
          scene: this,
          x: object.x,
          y: object.y - 40,
          texture: object.type
        });

        this.obstacles.add(obstacle);
      }
    });
  }

  private bulletHitLayer(bullet: Bullet): void {
    if (bullet.scene) {
      let emitterBlue = bullet.scene.add.particles('blue').createEmitter({
        x: bullet.x,
        y: bullet.y,
        speed: { min: -800, max: 800 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.5, end: 0 },
        blendMode: 'SCREEN',
        //active: false,
        lifespan: 600,
        gravityY: 800
      });
    
      bullet.scene.time.addEvent({
        delay: 100,
        callback : () => {
          emitterBlue.remove();
          bullet.destroy();
        }
      })
      
      bullet.destroy();
    }
  }

  private bulletHitObstacles(bullet: Bullet, obstacle: Obstacle): void {
    if (bullet.scene) {
      let emitterBlue = bullet.scene.add.particles('blue').createEmitter({
        x: bullet.x,
        y: bullet.y,
        speed: { min: -800, max: 800 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.5, end: 0 },
        blendMode: 'SCREEN',
        //active: false,
        lifespan: 600,
        gravityY: 800
      });
    
      bullet.scene.time.addEvent({
        delay: 100,
        callback : () => {
          emitterBlue.remove();
          bullet.destroy();
        }
      })
      bullet.destroy();
    }
  }

  private enemyBulletHitPlayer(bullet: Bullet, player: Player): void {
    if (bullet.scene) {
      let smokeEmitter = bullet.scene.add.particles('smoke').createEmitter({
        x: player.x,
        y: player.y,
        speed: { min: -800, max: 800 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.5, end: 0 },
        blendMode: 'SCREEN',
        //active: false,
        lifespan: 600,
        gravityY: 800
      });
    
      bullet.scene.time.addEvent({
        delay: 100,
        callback : () => {
          //emi.stop();
          smokeEmitter.remove();
          bullet.destroy();
        }
      })
      bullet.destroy();
    }
    player.updateHealth();
  }

  private playerBulletHitEnemy(bullet: Bullet, enemy: Enemy): void {
    if (this.shootingEmitter) {
      this.shootingEmitter.setPosition(enemy.x, enemy.y);
      this.shootingEmitter.start();
      this.time.addEvent({
        delay: 100,
        callback: () => {
          this.shootingEmitter.stop();
        }
      })
    }
    if (this.burningSound)
      this.burningSound.play();
    bullet.destroy();
    enemy.updateHealth();
    this.addScore();
  }
  
  private addScore() {
    let getCurrentPoints = this.registry.get('score');
    this.registry.set('score', getCurrentPoints + 10);
    this.events.emit('scoreChanges');
    let currentHighest = this.registry.get('highest');
    if (getCurrentPoints + 10 > currentHighest) this.registry.set('highest', getCurrentPoints + 10);
  }
}
