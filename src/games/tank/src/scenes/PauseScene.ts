export class PauseScene extends Phaser.Scene {
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
    private containerButtonResume: Phaser.GameObjects.Container;
    private containerButtonNewGame:  Phaser.GameObjects.Container;
    private muteButton: Phaser.GameObjects.Container;
    private containerScene: Phaser.GameObjects.Container;
    constructor() {
        super({
          key: 'PauseScene'
        });
    }
    init() {

    }
    create() {
      this.scene.bringToTop();

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
        var pause_label = this.add.image(0, 0, 'buttonNew').setOrigin(0.5, 0.5);
        let returnText = this.add.bitmapText(0, 0, 'mainFont', 'Resume', 40).setOrigin(0.5, 0.5);
        this.containerButtonResume = this.add.container(this.sys.canvas.width / 2 - 200, 800, [ pause_label, returnText ]).setScrollFactor(0);
        this.containerButtonResume.setSize(pause_label.width, pause_label.height);
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
        let new_label = this.add.image(0, 0, 'buttonNew').setOrigin(0.5, 0.5);
        let newText = this.add.bitmapText(0, 0, 'mainFont', 'New Game', 40).setOrigin(0.5, 0.5);
        this.containerButtonNewGame = this.add.container(this.sys.canvas.width / 2 + 200, 800, [ new_label, newText ]).setScrollFactor(0);
        this.containerButtonNewGame.setSize(new_label.width, new_label.height);
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
        let muteLabel = this.add.image(0, 0, 'buttonNew').setOrigin(0.5, 0.5);
        let textMute;
        if (this.game.sound.mute == true) textMute = 'Unmute';
        else textMute = 'Mute';
        let muteText = this.add.bitmapText(0, 0, 'mainFont', textMute, 40).setOrigin(0.5, 0.5);
        this.muteButton = this.add.container(this.sys.canvas.width / 2, 600, [ muteLabel, muteText ]).setScrollFactor(0);
        this.muteButton.setSize(muteLabel.width, muteLabel.height);
        this.muteButton.setInteractive();
        this.muteButton.on('pointerover', function() {
          muteLabel.setTint(0x44ff44);
        });
        this.muteButton.on('pointerout', function () {

          muteLabel.clearTint();
    
        });
    
        this.muteButton.on('pointerdown',  () => {
          if (this.game.sound.mute == false) {
          this.game.sound.mute = true;
          muteText.setText('Unmute');
          }
          else {
            this.game.sound.mute = false;
            //muteLabel.clearTint();
            muteText.setText('Mute');
          }
        });
        let bg = this.add.image(800, 700, 'backGround').setScrollFactor(0).setOrigin(0.5, 0.5).setScale(1.5);
        this.containerScene = this.add.container(0, 0, [ bg, this.muteButton, this.containerButtonResume, this.containerButtonNewGame ]).setScrollFactor(0);
    }
}