export class PauseScene extends Phaser.Scene {
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
    private containerButtonResume: Phaser.GameObjects.Container;
    private containerButtonNewGame:  Phaser.GameObjects.Container;
    private muteButton: Phaser.GameObjects.Container;
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

        //new game
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
        //mute
        var muteLabel = this.add.image(0, 0, 'red');
        this.muteButton = this.add.container(this.sys.canvas.width / 2 + 200, 400, [ muteLabel ]).setScrollFactor(0);
        this.muteButton.setSize(muteLabel.width,  muteLabel.height);
        this.muteButton.setInteractive();
        this.muteButton.on('pointerover', function() {
          muteLabel.setTint(0x44ff44);
        });
        this.muteButton.on('pointerout', function () {

          muteLabel.clearTint();
    
        });
    
        this.muteButton.on('pointerdown',  () => {
          this.game.sound.mute = !this.game.sound.mute;
          // this.scene.stop('PauseScene');
          // this.scene.start('GameScene');
        });

    }
}