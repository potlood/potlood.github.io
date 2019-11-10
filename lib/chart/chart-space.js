var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ChartStyle } from "./chart-style.js";
import { ChartPlotArea } from "./chart-plot-area.js";
import { ChartLegend } from "./chart-legend.js";
import { Rectangle } from "../utils/rectangle.js";
import { Style } from "../text/style.js";
import { ChartAxisPosition } from "./chart-axis.js";
export class ChartSpace {
    constructor() {
        this._promise = undefined;
        this._barChart = undefined;
        this.style = new ChartStyle();
        this.textStyle = new Style();
        this.plotArea = new ChartPlotArea();
        this.legend = undefined;
        this.bounds = new Rectangle(0, 0, 0, 0);
        // Hard coded text style.
        this.textStyle.runStyle.updateFont("Times New Roman", false, 11);
    }
    ensureLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._promise !== undefined) {
                yield this._promise;
                this._promise = undefined;
            }
        });
    }
    get barChart() {
        return this._barChart;
    }
    setBarChart(barChart) {
        this._barChart = barChart;
    }
    setPromise(promise) {
        this.ensureLoaded();
        this._promise = promise;
    }
    performLayout(_flow) {
        // Ensure layouting is done before external promise returns.
        const promise = new Promise((resolve, _reject) => __awaiter(this, void 0, void 0, function* () {
            yield this._promise;
            this._performLayout();
            resolve();
        }));
        this.setPromise(promise);
    }
    _performLayout() {
        let plotBounds = this.bounds.subtractSpacing(10);
        if (this.legend !== undefined) {
            this.legend.performLayout();
            if (!this.legend.overlayOnPlot) {
                let left = 0;
                let right = 0;
                let top = 0;
                let bottom = 0;
                switch (this.legend.position) {
                    case ChartAxisPosition.Left:
                        left += this.legend.bounds.width + ChartLegend.spacing;
                        break;
                    case ChartAxisPosition.Right:
                        right += this.legend.bounds.width + ChartLegend.spacing;
                        break;
                    case ChartAxisPosition.Top:
                        top += this.legend.bounds.height + ChartLegend.spacing;
                        break;
                    case ChartAxisPosition.Bottom:
                        bottom += this.legend.bounds.height + ChartLegend.spacing;
                        break;
                }
                plotBounds = plotBounds.subtractBorder(left, top, right, bottom);
            }
        }
        this.plotArea.bounds = plotBounds;
        this.plotArea.performLayout();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtc3BhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2hhcnQvY2hhcnQtc3BhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHaEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ2xELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN6QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUVwRCxNQUFNLE9BQU8sVUFBVTtJQVNuQjtRQVJRLGFBQVEsR0FBOEIsU0FBUyxDQUFDO1FBQ2hELGNBQVMsR0FBeUIsU0FBUyxDQUFDO1FBQzdDLFVBQUssR0FBZSxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQ3JDLGNBQVMsR0FBVSxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQy9CLGFBQVEsR0FBa0IsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUM5QyxXQUFNLEdBQTRCLFNBQVMsQ0FBQztRQUM1QyxXQUFNLEdBQWMsSUFBSSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFHakQseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVZLFlBQVk7O1lBQ3JCLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7Z0JBQzdCLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLFFBQVEsR0FB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