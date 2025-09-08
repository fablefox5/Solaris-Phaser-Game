import ButtonsContainer from '../../classes/UI/ButtonsContainer.js';
export class MainMenu extends Phaser.Scene {

    constructor() {
        super('MainMenu');
        this.buttonContainer = null;
        this.outlineEffect = null;
    }

    preload() {
        this.load.image('play-button', 'assets/PlayButton/Play_Button1.png');
        this.load.image('play-button-pressed', 'assets/PlayButton/Play_Button2.png');
        this.load.image('quit-button', 'assets/QuitButton/Quit_Button1.png');
        this.load.image('quit-button-pressed', 'assets/QuitButton/Quit_Button2.png');
        this.load.video('main-menu-bg-video', 'assets/MainMenu/MainMenuBG/MainMenuBGVideo.mp4', true);
        this.load.image('title', 'assets/MainMenu/MainMenuTitle.png');
        this.load.audio('main-menu-music', 'assets/Audio/MainMenuTheme.wav');

    }

    onHoverEnter(btn) {
        btn.setTint(0x0001000);
        console.log(btn.tint);
    }

    onHoverExit(btn) {
        console.log("exit");
        btn.tint = 16777215;
    }

    onClickBtnPressed(btn) {
        const btnKey = btn.texture.key.split('-')[0];
        btn.setTexture(`${btnKey}-button-pressed`);
     }

    onClickBtnUnPressed(btn) {
        const btnKey = btn.texture.key.split('-')[0];
        btn.setTexture(`${btnKey}-button`);

        if(btnKey === "play") {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            setTimeout(() => {
                this.scene.start("LevelSelect");
            }, 1000);
        }
        else if(btnKey === "Quit") {
            //idk why I have this since its a browser game lol
        }
    }
    

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        const {width, height} = this.game.canvas;
        const mainMenuBGVideo = this.add.video(0, 0, 'main-menu-bg-video').setOrigin(0, 0);
        mainMenuBGVideo.play(true);

        this.add.image(350, 100, 'title');
        console.log(this.textures.get('main-menu-bg').getFrameNames());
        const buttonImages = [
            'play-button',
            'quit-button'
        ]
        this.buttonContainer = new ButtonsContainer(
            this, 
            null, 
            350, 
            (height/2) - 50,
            buttonImages, 
            150,
            false,
            1.0,
            1.0);
        this.buttonContainer.enable();
        this.buttonContainer.setOnClickCallback(this.onClickBtnPressed.bind(this));
        this.buttonContainer.setOnUnClickCallback(this.onClickBtnUnPressed.bind(this));
        // this.buttonContainer.setOnHoverEnterCallback(this.onHoverEnter);
        // this.buttonContainer.setOnHoverExitCallback(this.onHoverExit);

        // this.anims.create({
        //     key: "move-text",
        //     frames: this.anims.generateFrameNumbers("win-game", {frames:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]}),
        //     frameRate: 16,
        //     repeat:-1
        // })

        this.registry.set('level', 0); //global value initialization for levels for planet positions
        this.registry.set('completed-levels', new Map());

        this.sound.add('main-menu-music', {volume: 0.2, loop: true}).play();
        
    }

    update() {

    }
    
}
