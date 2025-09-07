export class LevelSelect extends Phaser.Scene {

    constructor() {
        super('LevelSelect');
        this.buttonGrid = null;
        this.levelsCount = 6;
        this.cols = 10;
        this.rowGap = 40;
        this.buttonGap = 70;
        this.isCompletedIcons = [];
    }


    preload() {
        this.load.image('level-select', 'assets/LevelSelect/LevelSelect.png');
        this.load.image('completed-level', 'assets/LevelSelect/LevelCompleted.png');
        this.load.video('main-menu-bg-video', 'assets/MainMenu/MainMenuBG/MainMenuBGVideo.mp4', true);
    }


    createButton(buttonX, buttonY, isCompleted, i, graphics) {
            const levelButtonBox = this.add.rectangle(buttonX,
                                                      buttonY, 50, 50, 16, 0, 0);
            const levelButtonText = this.add.text(buttonX, buttonY, i, 
            { fill: '#0DDCF2', fontSize: '2rem'});
            levelButtonBox.setOrigin(0.3, 0.2);

            if(isCompleted) {
                console.log(i);
                const completedImg = this.add.image(buttonX-5, buttonY+5, 'completed-level')
                .setScale(0.35)
                .setOrigin(0.2, 0.3);
            }

            levelButtonBox.setInteractive({cursor: 'pointer'});

            levelButtonBox.on('pointerover', () => {
                console.log("pointer over");
                graphics.clear();
                graphics.fillStyle(0xf5f5f5, 0.2);
                graphics.fillRoundedRect(buttonX - 15, buttonY -10, 50, 50, 16);
            });

            levelButtonBox.on('pointerdown', () => {
                this.registry.set('level', i);
                this.cameras.main.fadeOut(1000, 0, 0, 0);
                setTimeout(() => {
                        this.scene.start("Play");
                }, 1000);
                });

            levelButtonText.setInteractive({cursor: 'pointer'});
            levelButtonText.on('pointerdown', () => {
                this.registry.set('level', i);
                this.cameras.main.fadeOut(1000, 0, 0, 0);
                setTimeout(() => {
                        this.scene.start("Play");
                }, 1000);
                });
    }


    create() {
        const {width, height} = this.game.canvas;
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        const mainMenuBGVideo = this.add.video(0, 0, 'main-menu-bg-video').setOrigin(0, 0);
        mainMenuBGVideo.play(true);
        mainMenuBGVideo.preFX.addBlur(2);

        const graphics = this.add.graphics();
        graphics.fillStyle(0xf5f5f5, 0.1);

        const xPos = (width/2) - ((this.cols) * this.buttonGap)/2;
        const yPos = (height/2) - ((this.levelsCount/this.cols) * this.rowGap)/2 - 150;

        let currentGap = 0;
        const isCompletedMap = this.registry.get('completed-levels');
        for(let i = 0; i <= this.levelsCount; i++) {
            if((i % this.cols) === 0) {
                currentGap += this.rowGap;
            }
            const levelButtonX = xPos + ((i % this.cols) * this.buttonGap);
            const levelButtonY = yPos + currentGap;
            const isCompleted = isCompletedMap.has(i) ? isCompletedMap.get(i) : false;
            this.createButton(levelButtonX, levelButtonY, isCompleted, i, graphics);
        }
        const levelSelectText = this.add.image(width/2, 100, 'level-select');
        const borderLineTop = this.add.line(0, height - 520, 
                                         (width/2)+600, 0, 
                                         (width/2)-600, 0, '0xf5f5f5').setOrigin(0, 0.5);

        const borderLineBottom = this.add.line(0, height - 100, 
                                         (width/2)+600, 0, 
                                         (width/2)-600, 0, '0xf5f5f5').setOrigin(0, 0.5);
                                         
        levelSelectText.setScale(0.7);
    }
}