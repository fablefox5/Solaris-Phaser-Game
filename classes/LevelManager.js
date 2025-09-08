export default class LevelManager {
    constructor(colors, userColor) {
        this.colors = colors;
        this.userColor = userColor;
        this.levelData = {
            0: 
                [
                    {
                    team: this.userColor,
                    x: 300, 
                    y: 150
                    },
                    
                    {
                    team: this.colors['noTeam'], 
                    x: 600, 
                    y: 600
                    },

                    {
                    team: this.colors['redTeam'], 
                    x: 1000, 
                    y: 200
                    }
                ],
            1: 
                [
                    {
                    team: this.userColor,
                    x: 600, 
                    y: 100
                    },
                    
                    {
                    team: this.colors['redTeam'], 
                    x: 100, 
                    y: 500
                    },

                    {
                    team: this.colors['noTeam'], 
                    x: 1000, 
                    y: 200
                    },
                    {
                    team: this.colors['noTeam'], 
                    x: 500, 
                    y: 500
                    }
                ],
            2: 
                [
                    {
                    team: this.userColor,
                    x: 100, 
                    y: 600
                    },
                    
                    {
                    team: this.colors['redTeam'], 
                    x: 1100, 
                    y: 150
                    },

                    {
                    team: this.colors['noTeam'], 
                    x: 600, 
                    y: 150
                    },
                    {
                    team: this.colors['noTeam'], 
                    x: 750, 
                    y: 600
                    }
                ],
            3: 
                [
                    {
                    team: this.userColor,
                    x: 200, 
                    y: 500
                    },
                    
                    {
                    team: this.userColor, 
                    x: 220, 
                    y: 250
                    },

                    {
                    team: this.colors['redTeam'], 
                    x: 1000, 
                    y: 100
                    },
                    {
                    team: this.colors['redTeam'], 
                    x: 1050, 
                    y: 520
                    },
                    {
                    team: this.colors['noTeam'], 
                    x: 600, 
                    y: 150
                    },
                    {
                    team: this.colors['noTeam'], 
                    x: 700, 
                    y: 650
                    },
                    {
                    team: this.colors['noTeam'], 
                    x: 650, 
                    y: 400
                    }
                ],
            4:  [
                    {
                    team: this.userColor,
                    x: 400, 
                    y: 150
                    },
                    {
                    team: this.colors['redTeam'], 
                    x: 1000, 
                    y: 150
                    },
                    {
                    team: this.colors['noTeam'], 
                    x: 150, 
                    y: 400
                    },
                    {
                    team: this.colors['noTeam'], 
                    x: 1050, 
                    y: 400
                    },
                ],
            5:  [
                    {
                    team: this.userColor,
                    x: 150, 
                    y: 150
                    },
                    {
                    team: this.userColor,
                    x: 1100, 
                    y: 600
                    },
                    {
                    team: this.colors['redTeam'], 
                    x: 150, 
                    y: 600
                    },
                    {
                    team: this.colors['redTeam'], 
                    x: 1100, 
                    y: 150
                    },
                     {
                    team: this.colors['noTeam'], 
                    x: 300, 
                    y: 350
                    },
                    {
                    team: this.colors['noTeam'], 
                    x: 500, 
                    y: 350
                    },
                     {
                    team: this.colors['noTeam'], 
                    x: 700,
                    y: 350
                    },
                    {
                    team: this.colors['noTeam'], 
                    x: 900, 
                    y: 350
                    },
                ],
            6:  [
                    {
                    team: this.userColor,
                    x: 300, 
                    y: 350
                    },
                    {
                    team: this.colors['redTeam'], 
                    x: 900, 
                    y: 350
                    },
                    {
                    team: this.colors['noTeam'], 
                    x: 150, 
                    y: 150
                    },
                    {
                    team: this.colors['noTeam'], 
                    x: 500, 
                    y: 350
                    },
                    {
                    team: this.colors['noTeam'], 
                    x: 700,
                    y: 350
                    },
                    {
                    team: this.colors['noTeam'], 
                    x: 150, 
                    y: 600
                    },
                    {
                    team: this.colors['noTeam'], 
                    x: 1100,
                    y: 150
                    },
                    {
                    team: this.colors['noTeam'], 
                    x: 1100, 
                    y: 600
                    },
                ],
        }
    }

    getLevel(levelNum) {
        return this.levelData[levelNum];
    }
}