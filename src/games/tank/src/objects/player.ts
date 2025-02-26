import { Bullet } from './Bullet';
import { IImageConstructor } from '../interfaces/IImageConstructor';
import { Enemy } from './Enemy';

export class Player extends Phaser.GameObjects.Image {
  body: Phaser.Physics.Arcade.Body;

  // variables
  private health: number;
  private nextShoot: number;
  private speed: number;

  // children
  barrel: Phaser.GameObjects.Image;
  private lifeBar: Phaser.GameObjects.Graphics;

  // game objects
  private bullets: Phaser.GameObjects.Group;
  private damage: number = 0.5;
  // input
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private rotateKeyLeft: Phaser.Input.Keyboard.Key;
  private rotateKeyRight: Phaser.Input.Keyboard.Key;
  private shootingKey: Phaser.Input.Keyboard.Key;
  //shooting tween
  private shootingTween: Phaser.Tweens.Tween;
  isShooting: boolean = false;

  public getBullets(): Phaser.GameObjects.Group {
    return this.bullets;
  }

  public getDamage(): number {
    return this.damage;
  }

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    this.initImage();
    this.scene.add.existing(this);
    
  }

  private initImage() {
    // variables
    this.health = 1;
    this.nextShoot = 0;
    this.speed = 100;

    // image
    this.setOrigin(0.5, 0.5);
    this.setDepth(0);
    this.angle = 180;

    this.barrel = this.scene.physics.add.image(this.x, this.y, 'barrelBlue');
    this.barrel.setOrigin(0.5, 1);
    this.barrel.setDepth(1);
    this.barrel.angle = 180;

    this.lifeBar = this.scene.add.graphics();
    this.redrawLifebar();

    // game objects
    this.bullets = this.scene.add.group({
      /*classType: Bullet,*/
      active: true,
      maxSize: 10,
      runChildUpdate: true
    });

    // input
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.rotateKeyLeft = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    this.rotateKeyRight = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );
    this.shootingKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // physics
    this.scene.physics.world.enable(this);
  }

  update(): void {
    if (this.active) {
      this.barrel.x = this.x;
      this.barrel.y = this.y;
      this.lifeBar.x = this.x;
      this.lifeBar.y = this.y;
      this.handleInput();
      this.handleShooting();
    } else {
      this.destroy();
      this.barrel.destroy();
      this.lifeBar.destroy();
    }

  }

  private handleInput() {
    // move tank forward
    // small corrections with (- MATH.PI / 2) to align tank correctly
    if (this.cursors.up.isDown) {
      // this.scene.physics.velocityFromRotation(
      //   this.rotation - Math.PI / 2,
      //   this.speed,
      //   this.body.velocity
      // );
      this.body.setVelocityY(-200);
    } else if (this.cursors.down.isDown) {
      // this.scene.physics.velocityFromRotation(
      //   this.rotation - Math.PI / 2,
      //   -this.speed,
      //   this.body.velocity
      // );
      this.body.setVelocityY(200);
    }
     else if (this.cursors.right.isDown) {
      this.body.setVelocityX(200);
    }
    else if (this.cursors.left.isDown) {
      this.body.setVelocityX(-200);
    }
    else {
      this.body.setVelocity(0, 0);
    }

    // rotate tank

    // rotate barrel
 
    if (this.rotateKeyLeft.isDown) {
      this.barrel.rotation -= 0.05;
      
    } else if (this.rotateKeyRight.isDown) {
      this.barrel.rotation += 0.05;
    }
  }

  private handleShooting(): void {
    if (this.shootingKey.isDown && this.scene.time.now > this.nextShoot) {
      this.scene.cameras.main.shake(20, 0.005);
      this.isShooting = true;
      this.scene.tweens.add({
        targets: this,
        props: { alpha: 0.8 },
        delay: 0,
        duration: 5,
        ease: 'Power1',
        easeParams: null,
        hold: 0,
        repeat: 0,
        repeatDelay: 0,
        yoyo: true,
        paused: false
      });
      if (this.shootingTween) this.shootingTween.stop();
      else 
      this.scene.tweens.add({
        targets: this.barrel,
        ease: 'Bounce.easeOut',
        scaleX: 1.5,
        scaleY: 1.5,
        yoyo: true,
        duration: 100,
        repeat: 0
      });
      if (this.bullets.getLength() < 10) {
        this.bullets.add(
          new Bullet({
            scene: this.scene,
            rotation: this.barrel.rotation,
            x: this.barrel.x,
            y: this.barrel.y,
            texture: 'bulletBlue'
          })
        );
        this.nextShoot = this.scene.time.now + 500;
      }
    }
  }

  private redrawLifebar(): void {
    this.lifeBar.clear();
    this.lifeBar.fillStyle(0xe66a28, 1);
    this.lifeBar.fillRect(
      -this.width / 2,
      this.height / 2,
      this.width * this.health,
      15
    );
    this.lifeBar.lineStyle(2, 0xffffff);
    this.lifeBar.strokeRect(-this.width / 2, this.height / 2, this.width, 15);
    this.lifeBar.setDepth(1);
  }

  public updateHealth(bulletDamage: number): void {
    if (this.health > 0) {
      this.health -= bulletDamage;
      this.redrawLifebar();
    } else {
      this.health = 0;
      this.active = false;
      this.scene.scene.stop('GameScene');
      this.scene.scene.start('OverScene');
    }
  }
}
