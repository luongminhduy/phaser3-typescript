export class PauseScene extends Phaser.Scene {
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
    private containerButtonResume: Phaser.GameObjects.Container;
    private containerButtonNewGame:  Phaser.GameObjects.Container;
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
        //resume
        var pause_label = this.add.image(0, 0, 'return').setScale(0.2);
        this.containerButtonResume = this.add.container(this.sys.canvas.width / 2, 700, [ pause_label ]).setScrollFactor(0);
        this.containerButtonResume.setSize(pause_label.width * 0.2, pause_label.height*0.2);
        this.containerButtonResume.setInteractive();
        
        this.containerButtonResume.on('pointerover', function() {
          console.log("over");
          pause_label.setTint(0x44ff44);
        });
        this.containerButtonResume.on('pointerout', function () {

            pause_label.clearTint();
    
        });
    
        this.containerButtonResume.on('pointerdown',  () => {
          this.scene.stop('PauseScene');
          this.scene.resume('GameScene');
          var sceneGamePlaying = this.scene.get('GameScene');
          sceneGamePlaying.scene.setVisible(true);
        });


        var new_label = this.add.image(0, 0, 'newGame').setScale(0.2);
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
          this.scene.stop('PauseScene');
          this.scene.start('GameScene');
        });
        
        

    }
}