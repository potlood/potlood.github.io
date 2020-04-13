import { InSequence } from "../utils/in-sequence.js";
import { TextFitter } from "./text-fitter.js";
import { Metrics } from "../utils/metrics.js";
import { ParagraphType } from "../paragraph/paragraph.js";
import { Size } from "../utils/geometry/size.js";
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
    getSize() {
        return new Size(this.getUsedWidth(), this.getHeight());
    }
    getUsedWidth() {
        let maxWidth = 0;
        this.getLines().forEach(line => maxWidth = Math.max(maxWidth, line.width));
        return maxWidth;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1ydW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGV4dC90ZXh0LXJ1bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsYUFBYSxFQUFRLE1BQU0sMkJBQTJCLENBQUM7QUFDaEUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRWpELE1BQU0sT0FBTyxPQUFPO0lBVWhCLFlBQVksS0FBZSxFQUFFLEtBQVk7UUFQbEMsZ0JBQVcsR0FBZSxVQUFVLENBQUMsSUFBSSxDQUFDO1FBQzFDLGtCQUFhLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztRQUNuQyxlQUFVLEdBQXVCLFNBQVMsQ0FBQztRQUUzQyxhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ1osV0FBTSxHQUFzQyxTQUFTLENBQUM7UUFHMUQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVNLE9BQU87UUFDVixPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRU0sWUFBWTtRQUNmLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzNFLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFTSxrQkFBa0I7UUFDckIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzlCLE9BQU8sT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFTSxTQUFTO1FBQ1osT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO0lBQzNELENBQUM7SUFFTSxRQUFRO1FBQ1gsSUFBSSxLQUE0QixDQUFDO1FBQ2pDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDM0IsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDdkI7YUFBTTtZQUNILE1BQU0sSUFBSSxLQUFLLENBQUMscURBQXFELENBQUMsQ0FBQztTQUMxRTtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxJQUFXLFlBQVk7UUFDbkIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVNLGFBQWEsQ0FBQyxJQUFpQjtRQUNsQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxQztJQUNMLENBQUM7SUFFTyxhQUFhLENBQUMsSUFBaUI7UUFDbkMsSUFBSSxLQUFLLEdBQTBCLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7WUFDdkIsTUFBTSxNQUFNLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7WUFDcEMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7U0FDeEI7YUFBTTtZQUNILElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1NBQ3JCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztDQUNKIn0=