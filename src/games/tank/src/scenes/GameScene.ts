import { Player } from '../objects/Player';
import { Enemy } from '../objects/Enemy';
import { Obstacle } from '../objects/obstacles/Obstacles';
import { Bullet } from '../objects/Bullet';

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
  private target: Phaser.Math.Vector2;
  private containerObjects: Phaser.GameObjects.Container;
  private shootingSound: Phaser.Sound.BaseSound;
  private burningSound: Phaser.Sound.BaseSound;
  private warSound: Phaser.Sound.BaseSound;
  private score: number = 0;
  private textScore: Phaser.GameObjects.BitmapText;
  private scoreContainer: Phaser.GameObjects.Container;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(): void {
    this.registry.set('score', 0);
  }
  
  create(): void {
    // create tilemap from tiled JSON
    this.shootingSound = this.sound.add('shooting');
    this.burningSound = this.sound.add('burning');
    this.warSound = this.sound.add('war');
    this.warSound.play();

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
    this.convertObjects();

    // collider layer and obstacles
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

    this.cameras.main.startFollow(this.player);
    //shooting effect
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
    let pauseLabel = this.add.image(0, 0, 'buttonNew');
    let menuText = this.add.bitmapText(
      //this.sys.canvas.width / 2 - 120,
      //200,
      0,
      0,
      'mainFont',
      'Menu',
      50
    ).setOrigin(0.5, 0.5);
    let container = this.add.container(0 + 200, 100, [ pauseLabel, menuText ]).setScrollFactor(0);
    container.setSize(pauseLabel.width, pauseLabel.height);
    container.setDepth(1000);
    container.setInteractive();
    
    container.on('pointerover', function() {
      pauseLabel
.setTint(0x44ff44);
    });
    container.on('pointerout', function() {
      pauseLabel
.clearTint();
    });

    container.on('pointerdown',  () => {
      // this.scene.pause('GameScene');
      // this.scene.setVisible(false);
      // this.scene.launch('PauseScene');
      this.scene.pause().launch('PauseScene');  
    });
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
  updateScore() {
    this.textScore.setText(`Score ${this.registry.get('score')}`);
  }

  update(): void {
    this.player.update();
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
    if (this.hitEmitter) {
      this.hitEmitter.setPosition(bullet.x, bullet.y);
      this.hitEmitter.start();
      this.time.addEvent({
        delay: 100,
        callback: () => {
          this.hitEmitter.stop();
        }
      }) 
    }
    bullet.destroy();
  }

  private bulletHitObstacles(bullet: Bullet, obstacle: Obstacle): void {
    if (this.hitEmitter) {
      this.hitEmitter.setPosition(bullet.x, bullet.y);
      this.hitEmitter.start();
      this.time.addEvent({
        delay: 100,
        callback: () => {
          this.hitEmitter.stop();
        }
      }) 
    }
    bullet.destroy();
  }

  private enemyBulletHitPlayer(bullet: Bullet, player: Player): void {
    bullet.destroy();
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
