import Unit from './Unit.js'

export default class Planet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, color, scale, maxLevel, health, group, isEmpty, startingNumUnits) {
        super(scene, x, y, texture);
        this.setScale(scale);
        this.level = color === '0x111111' ? 0 : 1;
        this.levelRequirements = [
            //levels 0-3, upgrading to 0->1, 1->2, 2->3
            10,
            20,
            30,
            40
        ];
        this.maxLevel = maxLevel;
        this.teamColor = color;
        this.tint = color;
        this.radius = 60 * scale;
        this.captureTeamColor = null;
        this.currentProgress = 0;
        this.health = health;
        this.graphics = scene.add.graphics();
        this.isEmpty = isEmpty;
        this.spawnInterval = null;
        scene.add.existing(this);
        scene.physics.add.existing(this);

        if(group) {
            group.add(this);
        }

        for(let i = 0; i < startingNumUnits; i++) {
            this.spawnUnit();
        }

        this.setSpawnInterval();
    }

    displayProgressBar(progressVal, captureTeamColor) {
        this.graphics.clear();
        this.graphics.lineStyle(5, captureTeamColor || 0xffffff, 1);
        this.graphics.beginPath();
        this.graphics.arc(this.x, this.y, this.radius+15, 0, Math.PI/180 * progressVal);
        this.graphics.strokePath();
    }

    unitCollide(unit) {
        //skips planet if not targeted

        if(unit.planetTarget !== this) {
            return;
        };

        // for self healing planets after partial capture
        if(unit.teamColor === this.teamColor && this.captureTeamColor !== null && 
        this.captureTeamColor !== this.teamColor && this.currentProgress > 0) {
            this.currentProgress -= unit.damage;
            unit.takeDamage(1);
            this.displayProgressBar(this.currentProgress*(360/this.levelRequirements[this.level]), this.captureTeamColor);
            return;
        }

        //for upgrading your own planets
        if(unit.teamColor === this.teamColor) {
            if(this.level < 3) {
                this.currentProgress += 1;
                unit.remove();
                this.captureTeamColor = this.teamColor;
                this.displayProgressBar(this.currentProgress*(360/this.levelRequirements[this.level]), unit.teamColor);
                if(this.currentProgress >= this.levelRequirements[this.level]) {
                    this.graphics.clear();
                    this.currentProgress = 0;
                    this.displayProgressBar(0, unit.teamColor);
                    this.level++;
                    this.setScale(this.scale + (this.level * 0.05));
                    this.radius += 15;
                    this.captureTeamColor = null;
                    this.setSpawnInterval();
            }
            }
        }
        //for enemies that attack empty or enemy planets
        else {
            if(this.captureTeamColor === null) {
                this.captureTeamColor = unit.teamColor;
                this.currentProgress += unit.damage;
                unit.takeDamage(1);
            }
            else if(this.captureTeamColor !== unit.teamColor) {
                if(this.currentProgress <= 0) {
                    this.currentProgress += unit.damage;
                    unit.takeDamage(1);
                    this.captureTeamColor = unit.teamColor; 
                }
                else {
                     this.currentProgress -= unit.damage;
                    unit.takeDamage(1);
                    this.displayProgressBar(this.currentProgress*(360/this.levelRequirements[this.level]), this.captureTeamColor);
                }
            }
            else {
                this.currentProgress += unit.damage;
                unit.takeDamage(1);
            }

            this.displayProgressBar(this.currentProgress*(360/this.levelRequirements[this.level]), this.captureTeamColor);
            if(this.currentProgress >= this.levelRequirements[this.level]) {
                this.graphics.clear();
                this.teamColor = unit.teamColor;
                this.tint = unit.teamColor;
                this.currentProgress = 0;
                this.level = 1;
                this.displayProgressBar(0, unit.teamColor);

                if(this.isEmpty) {
                    this.isEmpty = false;
                }
            }
        }
    }

    getSpawnableCoords() {
        const xCoordinate = this.x +(this.radius+50) * Math.cos(Math.random() * 360);
        const yCoordinate = this.y + (this.radius+50) * Math.sin(Math.random() * 360);
        return [xCoordinate, yCoordinate];
    }

    setSpawnInterval() {
        if(this.spawnInterval !== null) {
            clearInterval(this.spawnInterval);
        }

        this.spawnInterval = setInterval(() => {
            this.spawnUnit()
            }, 
        1000/this.level);
    }

    spawnUnit() {
        if(!this.isEmpty) {
            this.scene.numUnits++;
            const chosenCoordinates = this.getSpawnableCoords();
            const newUnit = new Unit(
            this.scene, 
            chosenCoordinates[0], 
            chosenCoordinates[1],
            'unit',
            this.teamColor,
            100,
            1,
            2,
            1,
            50,
            this.scene.units)
            .setDepth(2);
            // this.scene.units.set(newUnit.id, newUnit);
        }
    }

    // removeUnit() {
    //     this.numUnits--;
    // }

    getDistanceFromPlanet(other) {
        return Math.sqrt(Math.pow((other.x - this.x), 2) + Math.pow((other.y - this.y), 2));
    }

    distanceOuterCheck(givenX, givenY, dist) {
        //checks if given distance is less than distance between given points and planet
        //multiplies planet radius so it takes into account planet's radius as well
        return ((dist + this.radius) <= this.getDistanceFromPlanet({x: givenX, y: givenY}) 
            ? true : false);
    }

    distanceInnerCheck(givenX, givenY) {
        return (this.radius >= this.getDistanceFromPlanet({x: givenX, y: givenY})
            ? true : false);
    }
}