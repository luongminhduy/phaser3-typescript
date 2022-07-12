export class OverScene extends Phaser.Scene {
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
    private containerButtonNewGame:  Phaser.GameObjects.Container;
    constructor() {
        super({
          key: 'OverScene'
        });
    }

    init() {

    }

    addButtonNew() {
      var new_label = this.add.image(0, 0, 'buttonNew').setOrigin(0.5, 0.5);
      let newText = this.add.bitmapText(0, 0, 'mainFont', 'New Game', 40).setOrigin(0.5, 0.5);
      this.containerButtonNewGame = this.add.container(this.sys.canvas.width / 2, 700, [ new_label, newText ]).setScrollFactor(0);
      this.containerButtonNewGame.setSize(new_label.width, new_label.height);
      this.containerButtonNewGame.setInteractive();
      
      this.containerButtonNewGame.on('pointerover', function() {
        new_label.setTint(0x44ff44);
      });
      this.containerButtonNewGame.on('pointerout', function () {

          new_label.clearTint();
  
      });
  
      this.containerButtonNewGame.on('pointerdown',  () => {
        this.scene.stop('OverScene');
        this.scene.start('GameScene');
      });
    }

    create() {
        this.bitmapTexts.push(
            this.add.bitmapText(
              this.sys.canvas.width / 2 - 100,
              40,
              'font',
              'Game Over',
              30
            )
        );
        this.bitmapTexts.push(
            this.add.bitmapText(
              this.sys.canvas.width / 2 - 120,
              100,
              'font',
              'Your Score is ',
              30
            )
        );
        this.bitmapTexts.push(
            this.add.bitmapText(
              this.sys.canvas.width / 2 - 80,
              200,
              'scoreFont',
              `${this.registry.get('score')}`,
              80
            )
        );
        this.bitmapTexts.push(
            this.add.bitmapText(
              this.sys.canvas.width / 2 - 120,
              400,
              'font',
              'Highest Score ',
              30
            )
        );
        this.bitmapTexts.push(
            this.add.bitmapText(
              this.sys.canvas.width / 2 - 80,
              500,
              'scoreFont',
              `${this.registry.get('highest')}`,
              80
            )
        );
        this.addButtonNew();
    }
}
