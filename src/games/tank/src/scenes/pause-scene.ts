export class PauseScene extends Phaser.Scene {
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
    private containerButton: Phaser.GameObjects.Container;
    constructor() {
        super({
          key: 'PauseScene'
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
              'PAUSE SCENE',
              30
            )
        );
        var pause_label = this.add.image(0, 0, 'resume').setScale(0.2);
        this.containerButton = this.add.container(this.sys.canvas.width / 2 - 120, 300, [ pause_label ]).setScrollFactor(0);
        this.containerButton.setDepth(100);
        this.containerButton.setSize(pause_label.width * 0.2, pause_label.height*0.2);
        this.containerButton.setInteractive();
        
        this.containerButton.on('pointerover', function() {
          console.log("over");
          pause_label.setTint(0x44ff44);
        });
        this.containerButton.on('pointerout', function () {

            pause_label.clearTint();
    
        });
    
        this.containerButton.on('pointerdown',  () => {
          this.scene.stop('PauseScene');
          this.scene.resume('GameScene');
          var sceneGamePlaying = this.scene.get('GameScene');
          sceneGamePlaying.scene.setVisible(true);
        }); 
    }
}