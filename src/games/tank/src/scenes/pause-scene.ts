export class PauseScene extends Phaser.Scene {
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
    private containerButton: Phaser.GameObjects.Container[] = [];
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
              this.sys.canvas.height / 2,
              'font',
              'PAUSE SCENE',
              30
            )
        ); 
    }
}