// "Every great game begins with a single scene. Let's make this one unforgettable!"
import Planet from './Planet.js';
import Unit from './Unit.js';
import AIController from '../../classes/AIController.js';
import UnitFormator from '../../classes/UnitFormator.js';
import ButtonsContainer from '../../classes/UI//ButtonsContainer.js';
import EventManager from '../../classes/EventManager.js';
import LevelManager from '../../classes/LevelManager.js';
import VectorField from '../../classes/VectorField.js';


export class Play extends Phaser.Scene {
    constructor() {
        super('Play');
        this.planets = null;
        this.units = null;
        this.spawnedBullets = null;
        this.numUnits = 0;
        this.numSelected = 0;
        this.unitWidth = 10; //in pixels, approximation
        this.targetX = null;
        this.targetY = null;
        this.targetClicked = false;
        this.currentTarget = null;
        this.startingNumUnits = 10;
        this.isGameEnded = false;
        //UI
        this.formatButtonsContainer = null;
        this.WINDOW_HEIGHT = 720;
        this.WINDOW_WIDTH = 1280;
        this.colors = {
            'redTeam': 0xec2a00,
            'orangeTeam': 0xee9400,
            // 'purpleTeam': 0xac00ec,
            'noTeam': 0x111111 
        }

        this.colorsIndex = [
            0x111111, 
            0xec2a00,
            0xee9400
        ]
        this.userColor = this.colors['orangeTeam'];
        this.selectionArea = {
            'top-left-x': 0,
            'top-left-y': 0,
            'bottom-right-x': 0,
            'bottom-right-y': 0
        }

        this.unitFormator = new UnitFormator();
        this.eventManager = new EventManager(this.unitFormator);
        this.levelManager = new LevelManager(this.colors, this.userColor);
        this.vectorFieldManager = new VectorField(this);
        this.vectorDataMap = new Map();
        this.musicArray = [];
    }

    init() {
        // Initialize scene
        this.planets = this.physics.add.group();
        this.units = this.physics.add.group();
        this.spawnedBullets = this.physics.add.group();
    }

    selectionContains(x, y) {
        if(x >= this.selectionArea['top-left-x'] && x <= this.selectionArea['bottom-right-x']) {
            if(y >= this.selectionArea['top-left-y'] && y <= this.selectionArea['bottom-right-y']) {
                return true;
            }
        }
        return false;
    }

    checkTargetSelected(x, y) {
        for(let i = 0; i < this.planets.children.size; i++) {
            const planet = this.planets.children.entries[i];
            if(planet.distanceInnerCheck(x, y)) {
                this.currentTarget = planet;
                return;
            }
        }
        this.currentTarget = null;
    }


    preload() {
        // Load assets
        this.load.image('background', 'assets/Space-BG.png');
        this.load.image('target-location-selector', 'assets/target-location-selector.png');
        this.load.image('star-formation-icon', 'assets/SquareFormationIcon.png');
        this.load.image('square-formation-icon', 'assets/StarFormationIcon.png');
        this.load.image('unit', 'assets/Unit_1.png');
        this.load.image('planet', 'assets/Planet.png');
        this.load.image('bullet', 'assets/Bullet.png');
        this.load.spritesheet("win-game", "assets/Win/GameWin.png", {
            frameWidth: 512, 
            frameHeight: 256
        });

        this.load.spritesheet("lose-game", "assets/Lose/GameOver.png", {
            frameWidth: 512, 
            frameHeight: 256
        });
        this.load.image('next-button', 'assets/Next/Next_Button1.png');
        this.load.image('next-button-pressed', 'assets/Next/Next_Button2.png');
        this.load.image('retry-button', 'assets/Retry/Retry_Button1.png');
        this.load.image('retry-button-pressed', 'assets/Retry/Retry_Button2.png');
        
        this.load.audio('battle-1', 'assets/Audio/Battle1Theme.wav');
        this.load.audio('battle-2', 'assets/Audio/Battle2ThemeV2.wav');

        //initialize variables and initial settings
        const graphics = this.add.graphics();
        let isSelecting = false;
        this.input.mouse.disableContextMenu();
        const unitFormator = new UnitFormator();
        
        this.input.on('pointerdown', (pointer, objects) => {
            graphics.clear();
            //for dragging selection area for selecting units
            if(pointer.button === 0) {
                for(let i = 0; i < this.planets.children.size; i++) {
                    const unit = this.planets.children.entries[i];
                    
                }
                isSelecting = true;
            }
            //for choosing a target location for movement
            if(pointer.button === 2){
                this.targetClicked = true;
                this.targetX = pointer.x;
                this.targetY = pointer.y;
                this.checkTargetSelected(this.targetX, this.targetY);
                let currentSelectedIndex = 0;
                for(let i = 0; i < this.units.children.size; i++) {
                    const unit = this.units.children.entries[i];
                    if(unit.selected) {
                        if(this.currentTarget !== null) {
                            unit.planetTarget = this.currentTarget;
                            unit.move(this.targetX, this.targetY, 10);
                        }
                        else {
                            // let offset = this.unitFormationOffsetCalculator(currentSelectedIndex, this.targetX, this.targetY);
                            let offset = this.unitFormator.format(currentSelectedIndex, this.targetX, this.targetY);
                            unit.move(this.targetX + offset.x, this.targetY + offset.y, 10);
                            currentSelectedIndex += 1;
                        }
                    }
                }
                graphics.fillStyle(0xee9400, 1);
                const targetSelector = this.add.image(this.targetX, this.targetY, 'target-location-selector');
                targetSelector.setScale(0.3);
                this.tweens.add({
                    targets: targetSelector,
                    alpha: {from: 1, to: 0.0},
                    ease: 'Sine.InOut',
                    duration: 500,
                });

            }
        });

        this.input.on('pointerup', pointer => {
            if(pointer.button === 0) {
                graphics.clear();
                isSelecting = false;
            }
        });
        

        const selectLineColor = 0xFFFFFF;
        const selectLineAlpha = 0.8;
        const selectLineThickness = 1;
        this.input.on('pointermove', pointer => {
            if(isSelecting) {
                graphics.clear();
                graphics.lineStyle(selectLineThickness, selectLineColor, selectLineAlpha);
                graphics.strokeRect(pointer.downX, pointer.downY, pointer.x - pointer.downX, pointer.y - pointer.downY);

                //check if player dragged from left or right, causing downX/Y and x/y to be correct corners 
                this.calculateSelectionArea(pointer);
        
                for(let i = 0; i < this.units.children.size; i++) {
                    const unit = this.units.children.entries[i];
                    // if(!this.units[i].active) {
                    //     this.units.splice(i, 1);
                    // }

                    if(unit.teamColor !== this.userColor) {
                        continue;
                    }

                    if(this.selectionContains(unit.x, unit.y)) {
                        if(unit.selected === false) {
                            this.numSelected++;
                        }
                        unit.tint = 0x08f70b;
                        unit.selected = true;
                    }
                    else {
                        if(unit.selected === true) {
                            this.numSelected--;
                        }
                        unit.tint = unit.teamColor;
                        unit.selected = false;
                    }
                }
            }
        })
    }

    calculateSelectionArea(pointer) {
        if(pointer.downX < pointer.x) {
                    this.selectionArea['top-left-x'] = pointer.downX;
                    this.selectionArea['bottom-right-x'] = pointer.x;
                    if(pointer.downY < pointer.y) {
                        this.selectionArea['top-left-y'] = pointer.downY;
                        this.selectionArea['bottom-right-y'] = pointer.y;
                    }
                    else {
                        this.selectionArea['top-left-y'] = pointer.y;
                        this.selectionArea['bottom-right-y'] = pointer.downY;
                    }
                }
                else {
                    this.selectionArea['top-left-x'] = pointer.x;
                    this.selectionArea['bottom-right-x'] = pointer.downX;
                    if(pointer.downY < pointer.y) {
                        this.selectionArea['top-left-y'] = pointer.downY;
                        this.selectionArea['bottom-right-y'] = pointer.y;
                    }
                    else {
                        this.selectionArea['top-left-y'] = pointer.y;
                        this.selectionArea['bottom-right-y'] = pointer.downY;
                    }
                }
    }

    randomizePlanetPositions(numTeams, numPlanetsPerTeam, numEmptyPlanets) {
        for(let t = 0; t < numTeams; t++) {
            for(let i = 0; i < numPlanetsPerTeam; i++) {
                const chosenColor = this.colorsIndex[t+1];
                const chosenCoordinates = randomCoordinates(150, 50, 10);
                const newPlanet = new Planet(
                    this, 
                    chosenCoordinates[0], 
                    chosenCoordinates[1],
                    'planet',
                    chosenColor,
                    0.65,
                    1,
                    10,
                    this.planets,
                    false,
                    this.startingNumUnits
                    );

        }
        }

        for(let i = 0; i < numEmptyPlanets; i++) {
            const chosenColor = this.colors['noTeam'];
            const chosenCoordinates = randomCoordinates(50, 50, 10);
            const newPlanet = new Planet(
                this, 
                chosenCoordinates[0], 
                chosenCoordinates[1],
                'planet',
                chosenColor,
                0.65,
                1,
                10,
                this.planets,
                true,
                this.startingNumUnits
                );

        }

    }

    spawnPlanets(planetOrientations) {
        for(const planetDetails of planetOrientations) {
            const newPlanet = new Planet(
                    this, 
                    planetDetails.x, 
                    planetDetails.y,
                    'planet',
                    planetDetails.team,
                    0.65,
                    1,
                    10,
                    this.planets,
                    (planetDetails.team === this.colors.noTeam),
                    this.startingNumUnits
                    )
                    .setDepth(1);
            // this.vectorFieldManager.drawVectorField(this.vectorDataMap, planetDetails.x, planetDetails.y, 300, 1);
        }
    }

    create() {

        //variable constants
        const NUM_PLANETS_PER_TEAM = 1;
        const NUM_PLANETS_EMPTY = 1;
        const WINDOW_WIDTH = 1280;
        const WINDOW_HEIGHT = 720;
        const NUM_UNITS = 10;
        const NUM_TEAMS = 2;
        const graphics = this.add.graphics();
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.game.sound.stopAll();

        this.background = this.add.tileSprite(
            WINDOW_WIDTH/2, WINDOW_HEIGHT/2, WINDOW_WIDTH, WINDOW_HEIGHT, 'background')
        .setDepth(-1);

        const randomCoordinates = (planetRadius, edgeOffset, distOffset) => {
            let dist = 10000;
            //guarantees that planets wont be in edge of screen witho ffset
            let x, y;
            let isValid = false;
            while(!isValid) {
                x = Math.random() * WINDOW_WIDTH;
                y = Math.random() * WINDOW_HEIGHT;
                if(x < planetRadius*2+edgeOffset || x > WINDOW_WIDTH-(planetRadius*2)-edgeOffset) {
                    continue;
                }

                if(y < planetRadius*2+edgeOffset || y > WINDOW_HEIGHT-(planetRadius*2)-edgeOffset) {
                    continue;
                }

                isValid = true;
                for(let i = 0; i < this.planets.children.size; i++) {
                    if(!(this.planets.children.entries[i].distanceOuterCheck(x, y, planetRadius + distOffset))) {
                        isValid = false;
                        break;
                    }
                }
            }

            return [x, y];
        };

        // this.randomizePlanetPositions(NUM_TEAMS, NUM_PLANETS_PER_TEAM, NUM_PLANETS_EMPTY);
        console.log(this.levelManager.getLevel(this.registry.get('level')));
        this.spawnPlanets(this.levelManager.getLevel(this.registry.get('level')));
        console.log(this.vectorDataMap.get("216, 44"));

        this.physics.add.overlap(this.planets, this.units, (planet, unit) => {
            planet.unitCollide.bind(planet); 
            });

        this.physics.add.overlap(this.spawnedBullets, this.units, (bullet, enemy) => {
            if(enemy.teamColor != bullet.teamColor) {
                bullet.onHit(enemy);
            }
        }); 

        // UI
        const buttonImages = ['square-formation-icon', 'star-formation-icon'];
        this.formatButtonsContainer = new ButtonsContainer(
            this, 
            this.eventManager, 
            52, 
            WINDOW_HEIGHT-40,
            buttonImages, 
            80,
            true,
            0.4, 
            0.6);

        //create AI
        // const AIPlanets = this.planets.filter((element) => element.teamColor != this.userColor);
        // const arrayOfUnits = Array.from(this.units.values());
        // const AIUnits = arrayOfUnits.filter((element) => element.teamColor != this.userColor);
        
        const testAIAgent = new AIController(this.planets, this.units, this.colors['redTeam']);

        //Make it so each planet has units and then there's somehow a planet reference
        //where whenever a unit dies, it goes to the array from the planet's units.
        //Then in the play.js, it will get all units by looping over all planet's arrays for
        //units. This also adds another gameplay aspect where if a planet is taken over, all
        //units will either die or could be converted to the enemy.


        this.setupTextAnimations();

        this.musicArray.push(this.sound.add('battle-1', { volume: 0.2, loop: true}));
        this.musicArray.push(this.sound.add('battle-2', { volume: 0.2, loop: true}));
        
        this.musicArray[Math.floor(Math.random() * this.musicArray.length)].play();
    }

    setupTextAnimations() {
        this.anims.create({
            key: "move-text-win",
            frames: this.anims.generateFrameNumbers("win-game", {frames:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]}),
            frameRate: 16,
            repeat:-1
        })

        this.anims.create({
            key: "move-text-lose",
            frames: this.anims.generateFrameNumbers("lose-game", {frames:[0, 1, 2, 3, 4, 5]}),
            frameRate: 16,
            repeat:-1
        })
    }

    showGameEndUI() {
        function onClickBtnPressed(btn) {
            const btnKey = btn.texture.key.split('-')[0];
            btn.setTexture(`${btnKey}-button-pressed`);
        }

        function onClickBtnUnPressed(btn) {
            console.log("test");
            const btnKey = btn.texture.key.split('-')[0];
            btn.setTexture(`${btnKey}-button`);

            if(btnKey === "next") {
                this.registry.set('level',  this.registry.get('level') + 1);
            }

            this.restartScene();
        }

            const buttonImages = [
            'next-button',
            'retry-button'
        ]


        this.buttonContainer = new ButtonsContainer(
            this, 
            null, 
            this.WINDOW_WIDTH/2, 
            this.WINDOW_HEIGHT - 200,
            buttonImages, 
            100,
            false,
            1.0,
            1.0);
        this.buttonContainer.enable();
        this.buttonContainer.setOnClickCallback(onClickBtnPressed.bind(this));
        this.buttonContainer.setOnUnClickCallback(onClickBtnUnPressed.bind(this));
    }

    restartScene() {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        
        setTimeout(() => {
            this.scene.restart();
            }, 1000);
    }

    isGameOver() {
        let lastColor = this.planets.children.entries[0].teamColor;

        for(let i = 1; i < this.planets.children.size; i++) {
            if(this.planets.children.entries[i].teamColor === this.colors["noTeam"]) {
                continue;
            }

            if(this.planets.children.entries[i].teamColor !== lastColor) {
                return [false, null];
            }
        }

        return [true, lastColor];
    }

    gameWin() {
        // this.cameras.main.postFX.addBlur();
        const winText = this.add.sprite(this.WINDOW_WIDTH/2, 150, "win-game")
        .setDepth(3);

        winText.play("move-text-win", true);
        
        this.registry.get('completed-levels').set(this.registry.get('level'), true);
        
        // setTimeout(() => {
        //     this.scene.restart();
        // }, 10000);

    }

    gameLoss() {
        // this.cameras.main.postFX.addBlur();
        const loseText = this.add.sprite(this.WINDOW_WIDTH/2, 150, "lose-game")
        .setDepth(3);
        loseText.play("move-text-lose", true);

        // setTimeout(() => {
        //     this.scene.restart();
        // }, 10000);
    }

    update() {
        for(let i = 0; i < this.units.children.size; i++) {
            const unit = this.units.children.entries[i];
            unit.update();
        }

        if(this.formatButtonsContainer !== null) {
            if(this.numSelected > 0) {
                this.formatButtonsContainer.enable();
            }
            else {
                this.formatButtonsContainer.disable();
            }
        }

        const gameResults = this.isGameOver();
        if(gameResults[0] && !this.isGameEnded) {
            this.isGameEnded = true;
            this.showGameEndUI();
            if(gameResults[1] === this.userColor) {
                this.gameWin();
            }
            else {
                this.gameLoss();
            }
        }
    }

}
