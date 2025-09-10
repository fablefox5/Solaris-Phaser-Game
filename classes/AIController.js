export default class AIController {
    constructor(planets, units, teamColor) {
        this.planets = planets;
        this.units = units;
        this.teamColor = teamColor;
        this.state = new IdleState();
        this.stateWeights = {
            'IDLE': [0, 0.5],
            'ATTACK': [0.6, 0.8],
            'UPGRADE': [0.9, 1.0]
        }
        this.weightOffset = 0;
        this.startAI();
        this.state.runState(this);
        this.intervalTime = 12000;
    }

    startAI() {
        setInterval(() => {
            this.state = this.chooseState()
            this.state.runState(this);
            }, 12000);
    }

    calculateStateWeight() {
        //adds offset if more than 30 units in game, putting more chance of taking action
        const numUnitsSelf = this.units.children.entries.filter(unit => unit.teamColor === this.teamColor).size;
        if(this.units.children.size > 30 && numUnitsSelf > 20) {
            this.weightOffset += 0.08;
        }
        else {
            this.weightOffset = 0;
        }
        
        const weightRand = (Math.random()).toFixed(1);

        if(weightRand + this.weightOffset < 1.0) {
            return weightRand + this.weightOffset;
        }
        else {
            return weightRand;
        }
    }

    chooseState() {
        const weight = this.calculateStateWeight();
        if(weight >= this.stateWeights['IDLE'][0] && weight <= this.stateWeights['IDLE'][1]) {
            return new IdleState();
        }
        else if(weight >= this.stateWeights['ATTACK'][0] && weight <= this.stateWeights['ATTACK'][1]) {
            return new AttackState();
        }
        else if(weight >= this.stateWeights['UPGRADE'][0] && weight <= this.stateWeights['UPGRADE'][1]) {
            return new UpgradeState();
        }
        else {
            console.error(`weight: ${weight} not in range of [0, 1]`);
        }
        return undefined;
    }
}


class State {
    runState(AI) {
        console.error("Abstract class, do not directly call State's runState");
    }

    moveUnits(AI, targetPlanet) {
        for(let i = 0; i < AI.units.children.size; i++) {
        const unit = AI.units.children.entries[i];
        if(unit.teamColor === AI.teamColor) {
            unit.planetTarget = targetPlanet;
            unit.move(targetPlanet.x, targetPlanet.y, 10);
        }
        };
    }
}

class IdleState extends State {
    runState(AI) {
        // Nothing
    }
}

class AttackState extends State {
    runState(AI) {
        const numPlanets = AI.planets.children.size;
        let targetPlanet = null;
        while(true) {
            const i = Math.floor(Math.random() * numPlanets);
            const planet = AI.planets.children.entries[i];
            if(planet.teamColor !== AI.teamColor) {
                targetPlanet = planet;
                break;
            }
        }

        this.moveUnits(AI, targetPlanet);    

    }
}

class UpgradeState extends State {
    runState(AI) {
        const numPlanets = AI.planets.children.size;
        let targetPlanet = null;
        while(true) {
            const i = Math.floor(Math.random() * numPlanets);
            const planet = AI.planets.children.entries[i];
            if(planet.teamColor === AI.teamColor) {
                targetPlanet = planet;
                break;
            }
        }

        this.moveUnits(AI, targetPlanet);    
    }
}