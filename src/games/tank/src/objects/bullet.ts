import { IBulletConstructor } from '../interfaces/IBulletConstructor';

export class Bullet extends Phaser.GameObjects.Image {
  body: Phaser.Physics.Arcade.Body;
  damage: number = 0.05;
  
  private bulletSpeed: number;

  constructor(aParams: IBulletConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);
    
    this.rotation = aParams.rotation;
    this.initImage();
    this.scene.add.existing(this);
  }

  private initImage(): void {
    // variables
    this.bulletSpeed = 1000;

    // image
    this.setOrigin(0.5, 0.5);
    this.setDepth(2);
    
    // physics
    this.scene.physics.world.enable(this);
    this.scene.physics.velocityFromRotation(
      this.rotation - Math.PI / 2,
      this.bulletSpeed,
      this.body.velocity
    );
  }

  update(): void {}
}
