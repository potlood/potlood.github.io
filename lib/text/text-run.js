import { InSequence } from "../utils/in-sequence.js";
import { TextFitter } from "./text-fitter.js";
import { Metrics } from "../utils/metrics.js";
import { ParagraphType } from "../paragraph/paragraph.js";
export class TextRun {
    constructor(texts, style) {
        this.inParagraph = InSequence.Only;
        this.paragraphType = ParagraphType.Text;
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
    get hasEmptyText() {
        return this.texts.length === 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1ydW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGV4dC90ZXh0LXJ1bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFHckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFMUQsTUFBTSxPQUFPLE9BQU87SUFVaEIsWUFBWSxLQUFlLEVBQUUsS0FBWTtRQVBsQyxnQkFBVyxHQUFlLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFDMUMsa0JBQWEsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO1FBQ25DLGVBQVUsR0FBdUIsU0FBUyxDQUFDO1FBRTNDLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFDWixXQUFNLEdBQXNDLFNBQVMsQ0FBQztRQUcxRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBRU0sWUFBWTtRQUNmLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5QixPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDMUIsQ0FBQztJQUVNLGtCQUFrQjtRQUNyQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUIsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVNLFNBQVM7UUFDWixPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7SUFDM0QsQ0FBQztJQUVNLFFBQVE7UUFDWCxJQUFJLEtBQTRCLENBQUM7UUFDakMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUMzQixLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUN2QjthQUFNO1lBQ0gsTUFBTSxJQUFJLEtBQUssQ0FBQyxxREFBcUQsQ0FBQyxDQUFDO1NBQzFFO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELElBQVcsWUFBWTtRQUNuQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRU0sYUFBYSxDQUFDLElBQWlCO1FBQ2xDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFDO0lBQ0wsQ0FBQztJQUVPLGFBQWEsQ0FBQyxJQUFpQjtRQUNuQyxJQUFJLEtBQUssR0FBMEIsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtZQUN2QixNQUFNLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztZQUNwQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztTQUN4QjthQUFNO1lBQ0gsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7U0FDckI7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0NBQ0oifQ==