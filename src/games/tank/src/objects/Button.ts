export class Button {
    x: number;
    y: number;
    scene: Phaser.Scene;
    buttonImg: Phaser.GameObjects.Image;
    text: Phaser.GameObjects.BitmapText;
    container: Phaser.GameObjects.Container;

    constructor(x: number, y: number, scene: Phaser.Scene, name: string) {
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.buttonImg = this.scene.add.image(0, 0, 'buttonNew');
        this.text = this.scene.add.bitmapText(
            0,
            0,
            'mainFont',
            name,
            40
        ).setOrigin(0.5, 0.5);
    }

    create(scene: Phaser.Scene): Phaser.GameObjects.Container {
        this.container = scene.add.container(this.x, this.y, [this.buttonImg, this.text])
            .setScrollFactor(0)
            .setSize(this.buttonImg.width, this.buttonImg.height)
            .setDepth(1000)
            .setInteractive();
        return this.container;
    }

    setInteract() {
        this.container.on('pointerover', () => {
            this.buttonImg.setTint(0x44ff44);
        });

        this.container.on('pointerout', () => {
            this.buttonImg.clearTint();
        })
    }

}