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
    getX() {
        let x = this._xMin;
        const obstacle = this._getApplicableObstacle();
        if (obstacle !== undefined) {
            // Is obstacle all the width?
            const isWide = obstacle.width >= (this._xMax - this._xMin);
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
    getReferenceX(reference) {
        let x = this._xMin;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1mbG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL3ZpcnR1YWwtZmxvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUlwRSxNQUFNLE9BQU8sV0FBVztJQXFDcEIsWUFBWSxJQUFZLEVBQUUsSUFBWSxFQUFFLFdBQW1CLENBQUM7UUEvQnBELGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBQ3hCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsV0FBTSxHQUFjLEVBQUUsQ0FBQztRQUN2QixVQUFLLEdBQVEsRUFBRSxDQUFDO1FBQ2hCLGVBQVUsR0FBVSxFQUFFLENBQUM7UUE0QjNCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUE3Qk0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUE0QjtRQUNsRCxNQUFNLElBQUksR0FBRyxJQUFJLFdBQVcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLDhDQUE4QztRQUM5QywwQkFBMEI7UUFDMUIsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQ3ZCLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQztZQUNwQixJQUFJLE9BQU8sQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFO2dCQUNqQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQzthQUNqQztZQUNELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7WUFDdEMsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUMxQixnRUFBZ0U7YUFDbkU7WUFDRCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO1lBQ3RDLElB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QUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUM1QixNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDMUIsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3BDLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFTyxzQkFBc0I7UUFDMUIsSUFBSSxLQUFLLEdBQW9CLFNBQVMsQ0FBQztRQUN2QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDN0MsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzFDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixNQUFNO2FBQ1Q7U0FDSjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7Q0FDSiJ9