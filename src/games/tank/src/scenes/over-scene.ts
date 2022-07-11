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
    create() {
        this.bitmapTexts.push(
            this.add.bitmapText(
              this.sys.canvas.width / 2 - 120,
              40,
              'font',
              'Over Scene',
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
              this.sys.canvas.width / 2 - 120,
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
              this.sys.canvas.width / 2 - 120,
              500,
              'scoreFont',
              `${this.registry.get('highest')}`,
              80
            )
        );
        var new_label = this.add.image(0, 0, 'buttonNew');
        this.containerButtonNewGame = this.add.container(this.sys.canvas.width / 2 + 200, 700, [ new_label ]).setScrollFactor(0);
        this.containerButtonNewGame.setSize(new_label.width*0.2, new_label.height*0.2);
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
}
