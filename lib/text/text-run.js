import { InSequence } from "../utils/in-sequence.js";
import { TextFitter } from "./text-fitter.js";
import { Metrics } from "../utils/metrics.js";
export class TextRun {
    constructor(texts, style) {
        this.inParagraph = InSequence.Only;
        this.linkTarget = undefined;
        this.lastXPos = 0;
        this._lines = undefined;
        this.style = style;
        this.texts = texts;
    }
    getUsedWidth() {
        const lines = this.getLines();
        return lines[0].width;
    }
    getWidthOfLastLine() {
        const lines = this.getLines();
        return Metrics.getTextWidth(lines[lines.length - 1].text, this.style);
    }
    getHeight() {
        return this.getLines().length * this.style.lineSpacing;
    }
    getLines() {
        let lines;
        if (this._lines !== undefined) {
            lines = this._lines;
        }
        else {
            throw new Error("Rendering text which hasn't been included in layout");
        }
        return lines;
    }
    performLayout(flow) {
        if (this._lines === undefined) {
            this._lines = this._getFlowLines(flow);
        }
    }
    _getFlowLines(flow) {
        let lines = [];
        if (!this.style.invisible) {
            const fitter = new TextFitter(this);
            fitter.getFlowLines(flow);
            this.lastXPos = fitter.lastXPadding;
            lines = fitter.lines;
        }
        else {
            this.lastXPos = 0;
        }
        return lines;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1ydW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGV4dC90ZXh0LXJ1bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFHckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUU5QyxNQUFNLE9BQU8sT0FBTztJQVNoQixZQUFZLEtBQWUsRUFBRSxLQUFZO1FBTmxDLGdCQUFXLEdBQWUsVUFBVSxDQUFDLElBQUksQ0FBQztRQUMxQyxlQUFVLEdBQXVCLFNBQVMsQ0FBQztRQUUzQyxhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ1osV0FBTSxHQUFzQyxTQUFTLENBQUM7UUFHMUQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVNLFlBQVk7UUFDZixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUIsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFFTSxrQkFBa0I7UUFDckIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzlCLE9BQU8sT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFTSxTQUFTO1FBQ1osT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO0lBQzNELENBQUM7SUFFTSxRQUFRO1FBQ1gsSUFBSSxLQUE0QixDQUFDO1FBQ2pDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDM0IsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDdkI7YUFBTTtZQUNILE1BQU0sSUFBSSxLQUFLLENBQUMscURBQXFELENBQUMsQ0FBQztTQUMxRTtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTSxhQUFhLENBQUMsSUFBaUI7UUFDbEMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUMzQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUM7SUFDTCxDQUFDO0lBRU8sYUFBYSxDQUFDLElBQWlCO1FBQ25DLElBQUksS0FBSyxHQUEwQixFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFO1lBQ3ZCLE1BQU0sTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO1lBQ3BDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1NBQ3hCO2FBQU07WUFDSCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztTQUNyQjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7Q0FDSiJ9