import { TextRun } from "../text/text-run.js";
import { ParStyle } from "./par-style.js";
import { FontMetrics } from "../utils/font-metrics.js";
export var ParagraphType;
(function (ParagraphType) {
    ParagraphType[ParagraphType["Text"] = 0] = "Text";
    ParagraphType[ParagraphType["TableCell"] = 1] = "TableCell";
    ParagraphType[ParagraphType["Drawing"] = 2] = "Drawing";
})(ParagraphType || (ParagraphType = {}));
export class Paragraph {
    constructor(runs, numberingRun) {
        this.type = ParagraphType.Text;
        this._runs = runs;
        this._numberingRun = numberingRun;
    }
    get style() {
        let parStyle;
        const firstRun = this._runs[0];
        if (firstRun instanceof TextRun) {
            const firstTextRun = firstRun;
            parStyle = firstTextRun.style.parStyle;
        }
        else {
            parStyle = new ParStyle();
        }
        return parStyle;
    }
    get runs() {
        return this._runs;
    }
    get numberingRun() {
        return this._numberingRun;
    }
    getUsedWidth(availableWidth) {
        let usedWidth = 0;
        const runs = this.runs;
        for (let i = 0; i < runs.length; i++) {
            const runsWidth = runs[i].getUsedWidth();
            if (runsWidth >= availableWidth) {
                usedWidth = availableWidth;
                break;
            }
            usedWidth += runsWidth;
        }
        return Math.min(usedWidth, availableWidth);
    }
    getHeight() {
        const style = this.style;
        let height = (style !== undefined) ? style.spacingAfter + style.spacingBefore : 0;
        this.runs.forEach(run => {
            height += run.getHeight();
        });
        return height;
    }
    performLayout(flow) {
        let previousXPos = 0;
        if (this.style !== undefined) {
            flow.advancePosition(this.style.spacingBefore);
        }
        if (this._numberingRun !== undefined) {
            const clonedFlow = flow.clone();
            // Fix bug in TextFitter.
            clonedFlow.advancePosition(-FontMetrics.getTopToBaseline(this._numberingRun.style));
            this._numberingRun.performLayout(clonedFlow);
            previousXPos = this._numberingRun.lastXPos;
        }
        this.runs.forEach(run => {
            run.previousXPos = previousXPos;
            run.performLayout(flow);
            previousXPos = run.lastXPos;
        });
        if (this.style !== undefined) {
            flow.advancePosition(this.style.spacingAfter);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYWdyYXBoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhcmFncmFwaC9wYXJhZ3JhcGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBSTlDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFdkQsTUFBTSxDQUFOLElBQVksYUFJWDtBQUpELFdBQVksYUFBYTtJQUNyQixpREFBUSxDQUFBO0lBQ1IsMkRBQWEsQ0FBQTtJQUNiLHVEQUFXLENBQUE7QUFDZixDQUFDLEVBSlcsYUFBYSxLQUFiLGFBQWEsUUFJeEI7QUFFRCxNQUFNLE9BQU8sU0FBUztJQUtsQixZQUFZLElBQThCLEVBQUUsWUFBaUM7UUFDekUsSUFBSSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO0lBQ3RDLENBQUM7SUFFRCxJQUFXLEtBQUs7UUFDWixJQUFJLFFBQWtCLENBQUM7UUFDdkIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLFFBQVEsWUFBWSxPQUFPLEVBQUU7WUFDN0IsTUFBTSxZQUFZLEdBQUcsUUFBbUIsQ0FBQztZQUN6QyxRQUFRLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7U0FDMUM7YUFBTTtZQUNILFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1NBQzdCO1FBQ0QsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVELElBQVcsSUFBSTtRQUNYLE9BQU8sSUFBSSxDQUFDLEtBQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQs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