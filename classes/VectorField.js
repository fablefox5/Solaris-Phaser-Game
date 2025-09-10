export default class VectorField {
    constructor(scene) {
        this.scene = scene;
        this.planets = [];
    }
    
    createVector(x, y, centerX, centerY) {

        const dx = x - centerX;
        const dy = y - centerY;

        let Vx = -dy;
        let Vy = dx;

        const magnitude = Math.sqrt(Vx * Vx + Vy * Vy);

        if(magnitude > 0) {
            Vx /= magnitude;
            Vy /= magnitude;
        }

        return {x: Vx * 100, y: Vy * 100};
    }
    
    updateUnitOrbit(unit, centerX, centerY, dt) {
        const vec = this.createVector(unit.x, unit.y, centerX, centerY);

        unit.body.velocity.x += vec.x * 0.05 * dt;
        unit.body.velocity.y += vec.y * 0.05 * dt;

        // Clamp to max speed
        const maxSpeed = 150;
        if (unit.body.velocity.length() > maxSpeed) {
            unit.body.velocity.setLength(maxSpeed);
        }
    }

}
