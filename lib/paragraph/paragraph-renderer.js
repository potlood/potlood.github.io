import { TextRenderer } from "../text/text-renderer.js";
import { DrawingRenderer } from "../drawing/drawing-renderer.js";
import { TextRun } from "../text/text-run.js";
export class ParagraphRenderer {
    constructor(painter) {
        this._textRenderer = new TextRenderer(painter);
        this._drawingRenderer = new DrawingRenderer(painter);
    }
    renderParagraph(par) {
        let previousXPos = 0;
        if (par.numberingRun !== undefined) {
            this._textRenderer.renderTextRun(par.numberingRun);
            previousXPos = par.numberingRun.lastXPos;
        }
        par.runs.forEach((run) => {
            run.previousXPos = previousXPos;
            if (run instanceof TextRun) {
                this._textRenderer.renderTextRun(run);
            }
            else {
                this._drawingRenderer.renderDrawing(run);
            }
            previousXPos = run.lastXPos;
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYWdyYXBoLXJlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhcmFncmFwaC9wYXJhZ3JhcGgtcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUVqRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFOUMsTUFBTSxPQUFPLGlCQUFpQjtJQUkxQixZQUFZLE9BQWlCO1FBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFTSxlQUFlLENBQUMsR0FBYztRQUNqQyxJQUFJLFlBQVksR0FBdUIsQ0FBQyxDQUFDO1FBQ3pDLElBQUksR0FBRyxDQUFDLFlBQVksS0FBSyxTQUFTLEVBQUU7WUFDbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ25ELFlBQVksR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztTQUMxQztRQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDckIsR0FBRyxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7WUFDaEMsSUFBSSxHQUFHLFlBQVksT0FBTyxFQUFFO2dCQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN6QztpQkFBTTtnQkFDSCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzVDO1lBQ0QsWUFBWSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0oifQ==