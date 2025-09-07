export default class UnitFormator {
    constructor() {
        this.formatIndex = 0;
    }

    format(index, xCenter, yCenter) {
        switch(this.formatIndex) {
            case 0:
                return this.starFormator(index, xCenter, yCenter);
                break;
            case 1:
                return this.squareFormator(index, xCenter, yCenter);
                break;
        }
    }
    setFormat(formatIndex) {
        this.formatIndex = formatIndex;
        console.log("format set: ", formatIndex);
    }

    getFormat() {
        return this.formatIndex;
    }

    starFormator(index, xCenter, yCenter) {
        if(index === 0) {
            return {
            x: 0,
            y: 0
        }

        }
        let xOffset = 0;
        let yOffset = 0;
        const gap = 20;
        const currentLayer = Math.ceil(index/8);

        switch(index % 8) {
            case 1:
                xOffset = 1;
                yOffset = 0;
                break;

            case 2:
                xOffset = 0;
                yOffset = 1;
                break;
            case 3:
                xOffset = 1;
                yOffset = 1;
                break;
            case 4:
                xOffset = -1;
                yOffset = 0;
                break;
            case 5:
                xOffset = 0;
                yOffset = -1;
                break;
            case 6:
                xOffset = -1;
                yOffset = 1;
                break;
            case 7:
                xOffset = 1;
                yOffset = -1;
                break;
            default:
                xOffset = -1;
                yOffset = -1;
                break;
        }
        return {
            x: xOffset * gap * currentLayer,
            y: yOffset * gap * currentLayer
        }
    }

    squareFormator(index, xCenter, yCenter) {
        if(index === 0) {
            return {
                x: 0,
                y: 0
            }
        }

        let xOffset = 0;
        let yOffset = 0;
        const gap = 20;
        const currentLayer = Math.ceil((-1 + Math.sqrt(index + 1))/2);


        const startingPosInLayer = (4 * Math.pow(currentLayer-1, 2) + (4 * (currentLayer-1)))+1;
        const Q1 = 3 + (2*(currentLayer-1)) + startingPosInLayer;
        const Q2 = 1 + (2*(currentLayer-1)) + Q1;
        const Q3 = 3 + (2*(currentLayer-1)) + Q2;
        const Q4 = 1 + (2*(currentLayer-1)) + Q3;


        if(index >= 0 && index < Q1) {
           xOffset = (currentLayer * - 1) + index - startingPosInLayer;
           yOffset = currentLayer * - 1;
        }
        else if(index >= Q1 && index < Q2) {
            xOffset = currentLayer;
            yOffset = ((currentLayer * - 1) + 1) + index - Q1;
        }
        else if(index >= Q2 && index < Q3) {
            xOffset = (currentLayer * - 1) + index - Q2;
            yOffset = currentLayer;
        }
        else if(index >= Q3 && index < Q4) {
            xOffset = currentLayer * -1;
            yOffset = ((currentLayer * - 1) + 1) + index - Q3;
        }

        return {
            x: xOffset * gap,
            y: yOffset * gap
        }



    }
}