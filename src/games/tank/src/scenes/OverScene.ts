import { Button } from "../objects/Button";
export class OverScene extends Phaser.Scene {
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
    private containerButtonNewGame:  Phaser.GameObjects.Container;
    constructor() {
        super({
          key: 'OverScene'
        });
    }

    create() {
      //Game Over Text
      this.addText(this.sys.canvas.width / 2 - 100, 40, 'Game Over');
      //Your score text
      this.addText(this.sys.canvas.width / 2 - 120, 100, 'Your Score is ');
      //score
      this.addScore(this.sys.canvas.width / 2 - 80, 200, 'score');
      //Highest score text
      this.addText(this.sys.canvas.width / 2 - 120, 400, 'Highest Score ');
      //Highest
      this.addScore(this.sys.canvas.width / 2 - 80, 500, 'highest');
      //Button for new game
      this.addButtonNew();
    }

    private addButtonNew() {
      const buttonX = this.sys.canvas.width / 2;
      const buttonY = 700;
      let button = new Button(buttonX, buttonY, this, 'New Game');
      this.containerButtonNewGame = button.create(this);
      button.setInteract();
      button.container.on('pointerdown', () => {
        this.scene.stop('OverScene');
        this.scene.start('GameScene');       
      })
    }

    private addText(x: number, y: number, text: string) {
      this.bitmapTexts.push(
        this.add.bitmapText(
          x,
          y,
          'font',
          text,
          30
        )
      );
    }

    private addScore(x: number, y: number, type: string) {
      this.bitmapTexts.push(
        this.add.bitmapText(
          x,
          y,
          'scoreFont',
          `${this.registry.get(type)}`,
          80
        )
      );
    }
}
