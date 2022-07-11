import { IImageConstructor } from '../interfaces/Image.Interface';

export class Tile extends Phaser.GameObjects.Image {
  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    // set image settings
    this.setOrigin(0.5, 0.5);
    this.setInteractive();

    this.scene.add.existing(this);
  }
}
