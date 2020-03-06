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
        this._type = ParagraphType.Text;
        this._runs = runs;
        this._numberingRun = numberingRun;
    }
    get style() {
        let idx = 0;
        while (idx < this._runs.length && !(this._runs[idx] instanceof TextRun)) {
            idx++;
            if (idx == this._runs.length) {
                return new ParStyle();
            }
        }
        const foundRun = this._runs[idx];
        if (foundRun === undefined) {
            return new ParStyle();
        }
        return foundRun.style.parStyle;
    }
    get runs() {
        return this._runs;
    }
    get numberingRun() {
        return this._numberingRun;
    }
    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
        this._runs.forEach(run => {
            if (run instanceof TextRun) {
                run.paragraphType = type;
            }
        });
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
        flow.mentionParagraphPosition();
        const startY = flow.getY();
        let previousXPos = 0;
        if (this.style !== undefined) {
            flow.advancePosition(this.style.spacingBefore);
        }
        if (this.style._tabStops !== undefined) {
            this.style._tabStops.forEach(stop => {
                stop.performLayout(flow);
                if (stop.isClear) {
                    flow.removeTabStop();
                }
                else {
                    flow.addTabStop(stop);
                }
            });
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
            flow.mentionCharacterPosition(run.lastXPos);
        });
        if (this.style !== undefined) {
            flow.advancePosition(this.style.spacingAfter);
        }
        const lineSpacing = this._getLineSpacing();
        if (flow.getY() - startY < lineSpacing) {
            flow.advancePosition(lineSpacing);
        }
    }
    _getLineSpacing() {
        return (this.runs[0] instanceof TextRun) ? this.runs[0].style.lineSpacing : 10;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYWdyYXBoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhcmFncmFwaC9wYXJhZ3JhcGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBSTlDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFdkQsTUFBTSxDQUFOLElBQVksYUFJWDtBQUpELFdBQVksYUFBYTtJQUNyQixpREFBUSxDQUFBO0lBQ1IsMkRBQWEsQ0FBQTtJQUNiLHVEQUFXLENBQUE7QUFDZixDQUFDLEVBSlcsYUFBYSxLQUFiLGFBQWEsUUFJeEI7QUFFRCxNQUFNLE9BQU8sU0FBUztJQUtsQixZQUFZLElBQThCLEVBQUUsWUFBaUM7UUFDekUsSUFBSSxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO0lBQ3RDLENBQUM7SUFFRCxJQUFXLEtBQUs7UUFDWixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDWixPQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBWSxPQUFPLENBQUMsRUFBRTtZQUNwRSxHQUFHLEVBQUUsQ0FBQztZQUNOLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUMxQixPQUFPLElBQUksUUFBUSxFQUFFLENBQUM7YUFDekI7U0FDSjtRQUNELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsSUFBSSxRQUFRLEtBQUss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