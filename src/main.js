import { MainMenu } from './scenes/MainMenu.js';
import { Play } from './scenes/Play.js';
import { LevelSelect } from './scenes/LevelSelect.js';

const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    dom: {
        createContainer: true
    },
    width: 1280,
    height: 720,
    backgroundColor: '#ffffff',
    pixelArt: true,
    scene: [
        MainMenu,
        LevelSelect,
        Play
        // Start
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    }
}

new Phaser.Game(config);
            