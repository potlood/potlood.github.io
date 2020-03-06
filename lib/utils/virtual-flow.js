import { ShapePositionReference } from "../drawing/shape-bounds.js";
export class VirtualFlow {
    constructor(xMin, xMax, position = 0) {
        this._lastParPos = 0;
        this._lastCharX = 0;
        this._stops = [];
        this._nums = {};
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
        return this._xMin;
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
        return this._xMax - this._xMin;
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
        return cloned;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1mbG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL3ZpcnR1YWwtZmxvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUdwRSxNQUFNLE9BQU8sV0FBVztJQW9DcEIsWUFBWSxJQUFZLEVBQUUsSUFBWSxFQUFFLFdBQW1CLENBQUM7UUE5QnBELGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBQ3hCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsV0FBTSxHQUFjLEVBQUUsQ0FBQztRQUN2QixVQUFLLEdBQVEsRUFBRSxDQUFDO1FBNEJwQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBN0JNLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBNEI7UUFDbEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFXLENBQUMsRUFBRSxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUMzQyw4Q0FBOEM7UUFDOUMsMEJBQTBCO1FBQzFCLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUN2QixJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUM7WUFDcEIsSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDakMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7YUFDakM7WUFDRCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO1lBQ3RDLElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtnQkFDMUIsZ0VBQWdFO2FBQ25FO1lBQ0QsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztZQUN0QyxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7Z0JB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