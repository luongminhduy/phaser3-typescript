export class HUDScene extends Phaser.Scene {
  private bitmapTexts: Phaser.GameObjects.BitmapText[];
  private scoreTween: Phaser.Tweens.Tween;
  private scoreText: Phaser.GameObjects.BitmapText;

  constructor() {
    super({
      key: 'HUDScene'
    });
  }

  init(): void {
    this.bitmapTexts = [];
  }

  create(): void {
    // create bitmap texts
    this.bitmapTexts.push(
      this.add.bitmapText(
        10,
        this.scene.systems.canvas.height - 20,
        'font',
        `Lives: ${this.registry.get('lives')}`,
        8
      )
    );
    this.bitmapTexts.push(
      this.scoreText = this.add.bitmapText(
        10,
        10,
        'font',
        `Points: ${this.registry.get('points')}`,
        8
      )
    );
    //score tweens
    this.scoreTween = this.add.tween({
      targets: this.scoreText,
      scaleX: 1.5,
      scaleY: 1.5,
      ease: 'Cubic.easeOut',
      yoyo: true,
      paused: true,
      duration: 300
    })

    // create events
    const level = this.scene.get('GameScene');
    level.events.on('pointsChanged', this.updatePoints, this);
    level.events.on('livesChanged', this.updateLives, this);
  }

  private updatePoints() {
    this.bitmapTexts[1].setText(`Points: ${this.registry.get('points')}`);
    this.scoreTween.play();
  }

  private updateLives() {
    this.bitmapTexts[0].setText(`Lives: ${this.registry.get('lives')}`);
  }
}
