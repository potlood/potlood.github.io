import { ShapePositionReference } from "../drawing/shape-bounds.js";
class Obstacle {
    constructor(bounds, isFloating = false) {
        this.bounds = bounds;
        this.isFloating = isFloating;
    }
}
export class VirtualFlow {
    constructor(xMin, xMax, position = 0) {
        this._lastParPos = 0;
        this._lastCharX = 0;
        this._stops = [];
        this._nums = {};
        this._obstacles = [];
        this._xMin = xMin;
        this._xMax = xMax;
        this._pos = position;
    }
    static fromSection(section) {
        const flow = new VirtualFlow(40, 700 - 40);
        // this._width = content.clientWidth - 2 * 40;
        // this._pageHeight = 400;
        if (section !== undefined) {
            let pageWidth = 700;
            if (section.pageWidth !== undefined) {
                pageWidth = section.pageWidth;
            }
            const pageHeight = section.pageHeight;
            if (pageHeight !== undefined) {
                // this._pageHeight = Metrics.convertPointsToPixels(pageHeight);
            }
            const marginLeft = section.marginLeft;
            if (marginLeft !== undefined) {
                flow._xMin = marginLeft;
            }
            const marginRight = section.marginRight;
            if (marginRight !== undefined) {
                flow._xMax = pageWidth - marginRight;
            }
        }
        ;
        return flow;
    }
    getX(needsWidth = 0) {
        let x = this._xMin;
        const obstacle = this._getApplicableObstacle();
        if (obstacle !== undefined) {
            // Is obstacle all the width?
            const isWide = obstacle.bounds.width >= ((this._xMax - this._xMin) - needsWidth);
            if (isWide) {
                this.advancePosition(obstacle.bounds.height);
            }
            else {
                // TODO: Remove assumption that obstacle is to the left of the page
                x = obstacle.bounds.right;
            }
        }
        return x;
    }
    getReferenceX(reference, width) {
        let x = this.getX(width);
        // TODO: Support more reference modes.
        switch (reference) {
            case ShapePositionReference.Character:
                x = this._lastCharX;
                break;
            case ShapePositionReference.None:
            case ShapePositionReference.Column:
            default:
                x = this._xMin;
                break;
        }
        return x;
    }
    getY() {
        return this._pos;
    }
    getMaxY(includeFloating) {
        let maxY = this._pos;
        this._obstacles.forEach(obstacle => {
            if (!obstacle.isFloating || (includeFloating && obstacle.isFloating)) {
                maxY = Math.max(maxY, obstacle.bounds.bottom);
            }
        });
        return maxY;
    }
    getReferenceY(reference) {
        let pos = this._pos;
        // TODO: Support more reference modes.
        switch (reference) {
            case ShapePositionReference.Paragraph:
                pos = this._lastParPos;
                break;
            default:
                pos = this._pos;
                break;
        }
        return pos;
    }
    getWidth() {
        let width = this._xMax - this._xMin;
        const obstacle = this._getApplicableObstacle();
        if (obstacle !== undefined) {
            width -= obstacle.bounds.width;
        }
        return width;
    }
    addObstacle(bounds, isFloating) {
        this._obstacles.push(new Obstacle(bounds, isFloating));
    }
    copyObstaclesFrom(other) {
        other._obstacles.forEach(obstacle => {
            return this.addObstacle(obstacle.bounds, obstacle.isFloating);
        });
    }
    advanceX(startDelta, endDelta) {
        this._xMin += startDelta;
        this._xMax -= startDelta - endDelta;
        return this;
    }
    advancePosition(delta) {
        this._pos += delta;
        return this;
    }
    advanceNumbering(numId, level) {
        const id = `${numId}-${level}`;
        const currentNum = this._nums[id];
        if (currentNum === undefined) {
            this._nums[id] = 2;
        }
        else {
            this._nums[id] = currentNum + 1;
        }
    }
    getNumbering(numId, level) {
        const id = `${numId}-${level}`;
        return this._nums[id] || 1;
    }
    getTab(index) {
        return this._stops[index];
    }
    addTabStop(tabStop) {
        this._stops.push(tabStop);
    }
    removeTabStop() {
        this._stops.pop();
    }
    mentionParagraphPosition() {
        this._lastParPos = this._pos;
    }
    mentionCharacterPosition(xDelta) {
        this._lastCharX = this._xMin + xDelta;
    }
    clone() {
        const cloned = new VirtualFlow(this._xMin, this._xMax, this._pos);
        cloned._stops = this._stops;
        cloned._nums = this._nums;
        cloned._obstacles = this._obstacles;
        return cloned;
    }
    _getApplicableObstacle() {
        let found = undefined;
        for (let i = 0; i < this._obstacles.length; i++) {
            if (this._obstacles[i].bounds.intersectY(this._pos)) {
                found = this._obstacles[i];
                break;
            }
        }
        return found;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1mbG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL3ZpcnR1YWwtZmxvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUlwRSxNQUFNLFFBQVE7SUFJVixZQUFZLE1BQVcsRUFBRSxhQUFzQixLQUFLO1FBQ2hELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQ2pDLENBQUM7Q0FDSjtBQUVELE1BQU0sT0FBTyxXQUFXO0lBcUNwQixZQUFZLElBQVksRUFBRSxJQUFZLEVBQUUsV0FBbUIsQ0FBQztRQS9CcEQsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFDeEIsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixXQUFNLEdBQWMsRUFBRSxDQUFDO1FBQ3ZCLFVBQUssR0FBUSxFQUFFLENBQUM7UUFDaEIsZUFBVSxHQUFlLEVBQUUsQ0FBQztRQTRCaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7SUFDekIsQ0FBQztJQTdCTSxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQTRCO1FBQ2xELE1BQU0sSUFBSSxHQUFHLElBQUksV0FBVyxDQUFDLEVBQUUsRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDM0MsOENBQThDO1FBQzlDLDBCQUEwQjtRQUMxQixJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDdkIsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDO1lBQ3BCLElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7Z0JBQ2pDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO2FBQ2pDO1lBQ0Qs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