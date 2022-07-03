import { Ball } from '../objects/ball';
import { Brick } from '../objects/brick';
import { Player } from '../objects/player';
import { settings } from '../settings';

const BRICK_COLORS: number[] = [0xf2e49b, 0xbed996, 0xf2937e, 0xffffff];

export class GameScene extends Phaser.Scene {
  private ball: Ball;
  private bricks: Phaser.GameObjects.Group;
  private player: Player;
  private scoreText: Phaser.GameObjects.BitmapText;
  private highScoreText: Phaser.GameObjects.BitmapText;
  private livesText: Phaser.GameObjects.BitmapText;
  private particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private particlesSmoke: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private emitterSmoke: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(): void {
    settings.highScore = settings.score;
    settings.score = 0;
    settings.lives = 1;
  }

  create(): void {
    // game objects
    // ------------

    this.particles = this.add.particles('red');
    this.bricks = this.add.group();

    const BRICKS = settings.LEVELS[settings.currentLevel].BRICKS;
    const WIDTH = settings.LEVELS[settings.currentLevel].WIDTH;
    const HEIGHT = settings.LEVELS[settings.currentLevel].HEIGHT;
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        this.bricks.add(
          new Brick({
            scene: this,
            x: (settings.BRICK.WIDTH + settings.BRICK.SPACING) * x,
            y:
              settings.BRICK.MARGIN_TOP +
              y * (settings.BRICK.HEIGHT + settings.BRICK.SPACING),
            width: settings.BRICK.WIDTH,
            height: settings.BRICK.HEIGHT,
            fillColor: BRICK_COLORS[BRICKS[y * 14 + x]]
          })
        );
      }
    }

    // player
    this.player = new Player({
      scene: this,
      x: +this.game.config.width / 2 - 20,
      y: +this.game.config.height - 50,
      width: 50,
      height: 10
    });

    // ball
    this.ball = new Ball({ scene: this, x: 0, y: 0 }).setVisible(false);
    //smoke of ball
    this.particlesSmoke = this.add.particles('smoke');

    this.emitterSmoke = this.particlesSmoke.createEmitter({
        alpha: { start: 1, end: 0 },
        scale: { start: 0.5, end: 2.5 },
        //tint: { start: 0xff945e, end: 0xff945e },
        speed: 20,
        accelerationY: -300,
        angle: { min: -85, max: -95 },
        rotate: { min: -180, max: 180 },
        lifespan: { min: 400, max: 500 },
        blendMode: 'ADD',
        frequency: 60,
        //maxParticles: 10,
        x: -100,
        y: -100
    });
    //this.emitter.follow(this.ball);
    // score
    this.scoreText = this.add.bitmapText(
      10,
      10,
      'font',
      `Score: ${settings.score}`,
      8
    );

    this.highScoreText = this.add.bitmapText(
      10,
      20,
      'font',
      `Highscore: ${settings.highScore}`,
      8
    );

    this.livesText = this.add.bitmapText(
      10,
      30,
      'font',
      `Lives: ${settings.lives}`,
      8
    );

    // collisions
    // ----------
    this.physics.add.collider(this.player, this.ball);
    this.physics.add.collider(
      this.ball,
      this.bricks,
      this.ballBrickCollision,
      null,
      this
    );

    // events
    // ------
    this.events.on('scoreChanged', this.updateScore, this);
    this.events.on('livesChanged', this.updateLives, this);

    // physics
    // -------
    this.physics.world.checkCollision.down = false;
  }

  update(): void {
    this.player.update();

    if (!this.ball.visible) {
      this.ball.setPosition(this.player.x, this.player.y - 200);
      this.ball.applyInitVelocity();
      this.ball.setVisible(true);
    }

    if (this.ball.y > this.game.config.height) {
      settings.lives -= 1;
      this.events.emit('livesChanged');

      if (settings.lives === 0) {
        this.gameOver();
      } else {
        this.player.body.setVelocity(0);
        this.player.resetToStartPosition();
        this.ball.setPosition(0, 0);
        this.ball.body.setVelocity(0);
        this.ball.setVisible(false);
      }
    }
    if (this.ball && this.ball.x != 0 && this.ball.y != 0) {
      if (this.emitter)
        this.emitterSmoke.setPosition(this.ball.x, this.ball.y);
    }
  }

  private ballBrickCollision(ball: Ball, brick: Brick): void {
    brick.destroy();
    if (this.emitter) this.emitter.stop();
    this.emitter = this.particles.createEmitter({
      x: brick.x + brick.width/2,
      y: brick.y + brick.height/2,
      speed: { min: -200, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      blendMode: 'SCREEN',
      //active: false,
      lifespan: 300,
      gravityY: 800
    });
    this.time.addEvent({
      delay: 1000,
      callback: () => {this.emitter.stop()}
    });
    settings.score += 10;
    this.events.emit('scoreChanged');

    if (this.bricks.countActive() === 0) {
      // all bricks are gone!
    }
  }

  private gameOver(): void {
    this.scene.restart();
  }

  private updateScore(): void {
    this.scoreText.setText(`Score: ${settings.score}`);
  }

  private updateLives(): void {
    this.livesText.setText(`Lives: ${settings.lives}`);
  }
}
