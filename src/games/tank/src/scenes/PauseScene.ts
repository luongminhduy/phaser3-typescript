import { Button } from "../objects/Button";
export class PauseScene extends Phaser.Scene {
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
    private containerButtonResume: Phaser.GameObjects.Container;
    private containerButtonNewGame:  Phaser.GameObjects.Container;
    private muteButton: Phaser.GameObjects.Container;
    private containerScene: Phaser.GameObjects.Container;
    private backGround: Phaser.GameObjects.Image;
    constructor() {
        super({
          key: 'PauseScene'
        });
    }

    create() {
      this.scene.bringToTop();
      //text "Pause Scene"
      this.addTextPauseScene();
      //resume
      this.addButtonResume();
      //new game
      this.addButtonNewGame();
      //mute
      this.addButtonMute();
      //yellow background
      this.addBackGround();
      //container of all button
      this.addContainerScene();
    }

    private addButtonResume() {
      const buttonX = this.sys.canvas.width / 2 - 200;
      const buttonY = 800;
      let button = new Button(buttonX, buttonY, this, 'Resume');
      this.containerButtonResume = button.create(this);
      button.setInteract();
      button.container.on('pointerdown', () => {
        this.scene.stop('PauseScene');
        this.scene.resume('GameScene');
        let sceneGamePlaying = this.scene.get('GameScene');
        sceneGamePlaying.scene.setVisible(true);        
      })
    }

    private addButtonNewGame() {
      const buttonX = this.sys.canvas.width / 2 + 200;
      const buttonY = 800;
      let button = new Button(buttonX, buttonY, this, 'New Game');
      this.containerButtonNewGame = button.create(this);
      button.setInteract();
      button.container.on('pointerdown', () => {
        this.scene.stop('PauseScene');
        this.sound.removeAll();
        this.scene.start('GameScene');   
      })
    }

    private addButtonMute() {
      const buttonX = this.sys.canvas.width / 2;
      const buttonY = 600;
      let textMute;
      if (this.game.sound.mute == true) textMute = 'Unmute';
      else textMute = 'Mute';      
      let button = new Button(buttonX, buttonY, this, textMute);
      this.muteButton = button.create(this);
      button.setInteract();
      button.container.on('pointerdown', () => {
        if (this.game.sound.mute == false) {
          this.game.sound.mute = true;
          button.text.setText('Unmute');
        }
        else {
          this.game.sound.mute = false;
          button.text.setText('Mute');
        } 
      })
    }

    private addBackGround() {
      this.backGround = this.add.image(800, 700, 'backGround')
        .setScrollFactor(0)
        .setOrigin(0.5, 0.5)
        .setScale(1.5);
    }

    private addTextPauseScene() {
      this.bitmapTexts.push(
        this.add.bitmapText(
          this.sys.canvas.width / 2 - 120,
          40,
          'font',
          'PAUSE SCENE',
          30
        )
      );
    }

    private addContainerScene() {
      this.containerScene = this.add.container(-500,
         0, 
        [ this.backGround, 
          this.muteButton, 
          this.containerButtonResume, 
          this.containerButtonNewGame 
        ]).setScrollFactor(0);
      this.tweens.add({
        targets: this.containerScene,
        x: 0,
        duration: 100,
        ease: 'Sine.easeOut'
      })
    }
}