import Bullet from './Bullet.js';
export default class Unit extends Phaser.Physics.Arcade.Sprite { 
    constructor(scene, x, y, texture, color, range, damage, fireRate, health, speed, group) {
            super(scene, x, y, texture);
            this.teamColor = color;
            this.range = range;
            this.damage = damage;
            this.fireRate = fireRate;
            this.health = health;
            this.speed = speed;
            this.setScale(0.025);
            this.tint = color;
            this.selected = false;
            this.forwardVector = new Phaser.Math.Vector2(0, 0);
            scene.add.existing(this);
            scene.physics.add.existing(this);
            this.debugGraphics = scene.add.graphics();
            this.forwardVector;
            this.group = group;
            this.xTarget = null;
            this.yTarget = null;
            this.planetTarget = null;
            this.isMoving = false;
            this.stopDistance = 15;
            this.setInteractive();
            this.canShoot = true;

            this.on('pointerdown', () => {
                this.tint = 0x08f70b;
                this.selected = true;
            })
            if(this.group) {
                this.group.add(this);
            }
    }


    takeDamage(damage) {
        this.health -= damage;

        if(this.health === 0) {
            this.remove();
        }
    }
    

    remove() {
        // this.scene.units.delete(this.id);
        this.group.remove(this);
        this.destroy(false);
    }

    heal() {
        health++;
    }
    
    lookAt(xLookLoc, yLookLoc) {
        let lookVector = new Phaser.Math.Vector2(xLookLoc-Math.PI, yLookLoc-Math.PI);
        this.forwardVector = new Phaser.Math.Vector2(xLookLoc-this.x, yLookLoc-this.y).normalize();
        let angleToTarget = Phaser.Math.Angle.Between(this.x, this.y, lookVector.x, lookVector.y);
        this.rotation = angleToTarget+Math.PI/2;
    }

    lookAtVector() {
        if(this.body.velocity.length() > 0) {
            const angle = Phaser.Math.Angle.Between(0, 0, this.body.velocity.x, this.body.velocity.y);
            this.rotation = angle + (Math.PI / 2);
        }
    }

    move(xTarget, yTarget) {
        this.isMoving = true;
        this.lookAt(xTarget, yTarget);
        this.setVelocity(this.forwardVector.x * this.speed, this.forwardVector.y * this.speed);
        this.xTarget = xTarget;
        this.yTarget = yTarget;
    }

    attackUnit(unit) {
        //spawn bullet towards another unit
        const spawnedBullet = new Bullet(
            this.scene,
            this.x,
            this.y,
            'bullet',
            [unit.x, unit.y],
            100,
            this.teamColor,
            this.damage,
            this.scene.spawnedBullets
        );
        // unit.takeDamage(this.damage);
    }

    scanForEnemies() {
        for(let i = 0; i < this.group.children.size; i++) {
            const unit = this.group.children.entries[i];
            const distBetweenUnits = Math.sqrt(Math.pow((unit.x - this.x), 2) + Math.pow((unit.y - this.y), 2));
            if(unit.teamColor !== this.teamColor) {
                if(distBetweenUnits <= this.range) {
                    // console.log("attack this =>: ", unit);
                    if(this.canShoot) {
                        this.attackUnit(unit);
                        this.canShoot = false;
                        setTimeout(() => {
                            this.canShoot = true;
                        }, this.fireRate * 1000);
                    }
                } 
            }
        }
    }

    getNearestPlanet() {
        let shortestDist = Number.MAX_SAFE_INTEGER;
        let shortestPlanet = null;
        for(let i = 0; i < this.scene.planets.children.size; i++) {
            const planet = this.scene.planets.children.entries[i];
            const unitLoc = {x: this.x, y: this.y};
            const currDist = planet.getDistanceFromPlanet(unitLoc);
            if(currDist < shortestDist) {
                shortestDist = currDist;
                shortestPlanet = planet;
            }
        }
        return shortestPlanet;
    }

    orbit(strength, speedLimit, distanceLimit) {
        const center = {x: this.nearestPlanet.x, y: this.nearestPlanet.y};

        if(this.nearestPlanet.getDistanceFromPlanet({x: this.x, y: this.y}) > distanceLimit) {
            return;
        } 

        const vec = this.scene.vectorFieldManager.createVector(this.x,  this.y, center.x, center.y);
        this.body.velocity.x += vec.x * 0.05 * strength;
        this.body.velocity.y += vec.y * 0.05 * strength;

        if (this.body.velocity.length() > speedLimit) {
            this.body.velocity.setLength(speedLimit);
        }

        this.lookAtVector();
    }

    update() {
        this.nearestPlanet = this.getNearestPlanet();
        if(this.isMoving) {
            const distanceCalc = Math.sqrt(Math.pow((this.xTarget-this.x), 2) + Math.pow((this.yTarget-this.y), 2)); 
            if(distanceCalc < this.stopDistance) {
                this.setVelocity(0, 0);
                this.isMoving = false;
           }
            if(this.nearestPlanet.distanceInnerCheck(this.x, this.y)) {
                this.nearestPlanet.unitCollide(this);
            }
        }
        else {
            if(this.x >= 0 && 
            this.x < this.scene.WINDOW_WIDTH && 
            this.y >= 0 && 
            this.y < this.scene.WINDOW_HEIGHT) {
                if(this.nearestPlanet.teamColor === this.teamColor) {
                    this.orbit(5, 10, 150 + (5 * this.nearestPlanet.level));
                }
            }

        }
        this.scanForEnemies();
    }
}