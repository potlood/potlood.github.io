import { Metrics } from "./metrics.js";
export class VirtualFlow {
    constructor(xMin, xMax, position = 0) {
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
                pageWidth = Metrics.convertPointToPixels(section.pageWidth);
            }
            const pageHeight = section.pageHeight;
            if (pageHeight !== undefined) {
                // this._pageHeight = Metrics.convertPointsToPixels(pageHeight);
            }
            const marginLeft = section.marginLeft;
            if (marginLeft !== undefined) {
                flow._xMin = Metrics.convertTwipsToPixels(marginLeft);
            }
            const marginRight = section.marginRight;
            if (marginRight !== undefined) {
                flow._xMax = pageWidth - Metrics.convertTwipsToPixels(marginRight);
            }
        }
        ;
        return flow;
    }
    getX() {
        return this._xMin;
    }
    getY() {
        return this._pos;
    }
    getWidth() {
        return this._xMax - this._xMin;
    }
    advancePosition(delta) {
        this._pos += delta;
        return this;
    }
    createCellFlow(cell, table) {
        const cellSpacing = table.style.cellSpacing;
        let start = this.getX() + cell.getStart();
        start += cellSpacing;
        start += cell.style.margins.cellMarginStart;
        let width = cell.getWidth();
        width -= cell.style.margins.cellMarginStart;
        width -= cell.style.margins.cellMarginEnd;
        width -= 2 * cellSpacing;
        const leftBorder = cell.style.borders.borderStart;
        if (leftBorder !== undefined) {
            const leftBorderSize = leftBorder.size + leftBorder.spacing;
            start += leftBorderSize;
            width -= leftBorderSize;
        }
        const rightBorder = cell.style.borders.borderEnd;
        if (rightBorder !== undefined) {
            const rightBorderSize = rightBorder.size + rightBorder.spacing;
            width -= rightBorderSize;
        }
        const y = this._pos + cellSpacing;
        return new VirtualFlow(start, start + width, y);
    }
    clone() {
        return new VirtualFlow(this._xMin, this._xMax, this._pos);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1mbG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL3ZpcnR1YWwtZmxvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBS3ZDLE1BQU0sT0FBTyxXQUFXO0lBZ0NwQixZQUFZLElBQVksRUFBRSxJQUFZLEVBQUUsV0FBbUIsQ0FBQztRQUN4RCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBN0JNLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBNEI7UUFDbEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFXLENBQUMsRUFBRSxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUMzQyw4Q0FBOEM7UUFDOUMsMEJBQTBCO1FBQzFCLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUN2QixJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUM7WUFDcEIsSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDakMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDL0Q7WUFDRCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO1lBQ3RDLElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtnQkFDMUIsZ0VBQWdFO2FBQ25FO1lBQ0QsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztZQUN0QyxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ3pEO1lBQ0QsTUFBTSxXQUFXLEdB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