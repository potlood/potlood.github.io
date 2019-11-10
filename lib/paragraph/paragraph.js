import { TextRun } from "../text/text-run.js";
import { ParStyle } from "./par-style.js";
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
            this._numberingRun.performLayout(flow.clone());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYWdyYXBoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhcmFncmFwaC9wYXJhZ3JhcGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBSTlDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUUxQyxNQUFNLENBQU4sSUFBWSxhQUlYO0FBSkQsV0FBWSxhQUFhO0lBQ3JCLGlEQUFRLENBQUE7SUFDUiwyREFBYSxDQUFBO0lBQ2IsdURBQVcsQ0FBQTtBQUNmLENBQUMsRUFKVyxhQUFhLEtBQWIsYUFBYSxRQUl4QjtBQUVELE1BQU0sT0FBTyxTQUFTO0lBS2xCLFlBQVksSUFBOEIsRUFBRSxZQUFpQztRQUN6RSxJQUFJLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7SUFDdEMsQ0FBQztJQUVELElBQVcsS0FBSztRQUNaLElBQUksUUFBa0IsQ0FBQztRQUN2QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLElBQUksUUFBUSxZQUFZLE9BQU8sRUFBRTtZQUM3QixNQUFNLFlBQVksR0FBRyxRQUFtQixDQUFDO1lBQ3pDLFFBQVEsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztTQUMxQzthQUFNO1lBQ0gsUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7U0FDN0I7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBVyxJQUFJO1FBQ1gsT0FBTyxJQUFJLENBQUMsS0FBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFXLFlBQVk7UUFDbkIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzlCLENBQUM7SUFFTSxZQUFZLENBQUMsY0FBc0I7UUFDdEMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDakMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3pDLElBQUksU0FBUyxJQUFJLGNBQWMsRUFBRTtnQkFDN0IsU0FBUyxHQUFHLGNBQWMsQ0FBQztnQkFDM0IsTUFBTTthQUNUO1lBQ0QsU0FBUyxJQUFJLFNBQVMsQ0FBQztTQUMxQjtRQUNELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVNLFNBQVM7UUFDWixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksTUFBTSxHQUFHLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNwQixNQUFNLElBQUksR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVNLGFBQWEsQ0FBQyxJQUFpQjtRQUNsQyxJQUFJLFlBQVksR0FBdUIsQ0FBQyxDQUFDO1FBQ3pDLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ2xEO1FBQ0QsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLFNBQVMsRUFBRTtZQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUMvQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7U0FDOUM7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNwQixHQUFHLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztZQUNoQyxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hCLFlBQVksR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUMxQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDakQ7SUFDTCxDQUFDO0NBRUoifQ==