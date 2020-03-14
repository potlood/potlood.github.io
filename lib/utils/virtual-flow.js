import { ShapePositionReference } from "../drawing/shape-bounds.js";
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
            const isWide = obstacle.width >= ((this._xMax - this._xMin) - needsWidth);
            if (isWide) {
                this.advancePosition(obstacle.height);
            }
            else {
                // TODO: Remove assumption that obstacle is to the left of the page
                x = obstacle.right;
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
    getMaxY() {
        let maxY = this._pos;
        this._obstacles.forEach(bounds => {
            maxY = Math.max(maxY, bounds.bottom);
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
            width -= obstacle.width;
        }
        return width;
    }
    addObstacle(bounds) {
        this._obstacles.push(bounds);
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
            if (this._obstacles[i].intersectY(this._pos)) {
                found = this._obstacles[i];
                break;
            }
        }
        return found;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1mbG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL3ZpcnR1YWwtZmxvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUlwRSxNQUFNLE9BQU8sV0FBVztJQXFDcEIsWUFBWSxJQUFZLEVBQUUsSUFBWSxFQUFFLFdBQW1CLENBQUM7UUEvQnBELGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBQ3hCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsV0FBTSxHQUFjLEVBQUUsQ0FBQztRQUN2QixVQUFLLEdBQVEsRUFBRSxDQUFDO1FBQ2hCLGVBQVUsR0FBVSxFQUFFLENBQUM7UUE0QjNCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUE3Qk0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUE0QjtRQUNsRCxNQUFNLElBQUksR0FBRyxJQUFJLFdBQVcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLDhDQUE4QztRQUM5QywwQkFBMEI7UUFDMUIsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQ3ZCLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQztZQUNwQixJQUFJLE9BQU8sQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFO2dCQUNqQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQzthQUNqQztZQUNELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7WUFDdEMsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUMxQixnRUFBZ0U7YUFDbkU7WUFDRCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO1lBQ3RDLElB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