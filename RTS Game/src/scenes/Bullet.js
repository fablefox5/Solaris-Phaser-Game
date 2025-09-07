export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, direction, velocity, teamColor, damage, group) {
        super(scene, x, y, texture);
        this.direction = direction;
        this.velocity = velocity;
        this.teamColor = teamColor;
        this.damage = damage;
        this.tint = this.teamColor;
        this.scale = 0.05;
        // this.depth = 1;
        group.add(this);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.shoot();
    }

    shoot() {
        console.log("shooting");
        this.rotateTowardsAndMove(this.direction[0], this.direction[1]);
        setTimeout(() => {
         this.destroy(false);
        }, 10000);
    }

    onHit(enemy) {
        this.destroy(false);
        enemy.takeDamage(this.damage);
    }

    rotateTowardsAndMove(xDir, yDir) {
        let lookVector = new Phaser.Math.Vector2(xDir-Math.PI, yDir-Math.PI);
        this.forwardVector = new Phaser.Math.Vector2(xDir-this.x, yDir-this.y).normalize();
        let angleToTarget = Phaser.Math.Angle.Between(this.x, this.y, lookVector.x, lookVector.y);
        this.rotation = angleToTarget+Math.PI/2;
        this.setVelocity(this.forwardVector.x * this.velocity, this.forwardVector.y * this.velocity);
    }
}