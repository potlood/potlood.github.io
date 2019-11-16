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
import { LineRule } from "../paragraph/par-style.js";
export var ChartType;
(function (ChartType) {
    ChartType[ChartType["Bar"] = 0] = "Bar";
})(ChartType || (ChartType = {}));
export class ChartSpace {
    constructor() {
        this._promise = undefined;
        this._chart = undefined;
        this._type = ChartType.Bar;
        this.style = new ChartStyle();
        this.textStyle = new Style();
        this.legend = undefined;
        this.bounds = new Rectangle(0, 0, 0, 0);
        // Hard coded text style.
        this.textStyle.runStyle.updateFont("Arial", false, 11);
        this.textStyle.parStyle._lineSpacing = 240;
        this.textStyle.parStyle._lineRule = LineRule.atLeast;
        this.plotArea = new ChartPlotArea(this);
    }
    ensureLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._promise !== undefined) {
                yield this._promise;
                this._promise = undefined;
            }
        });
    }
    get chartType() {
        return this._type;
    }
    get chart() {
        return this._chart;
    }
    setBarChart(barChart) {
        this._chart = barChart;
        this._type = ChartType.Bar;
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
        this.plotArea.determineRange();
        let plotBounds = this.bounds.subtractSpacing(10);
        if (this.legend !== undefined) {
            plotBounds = this._layoutLegend(plotBounds, this.legend);
        }
        if (this.plotArea.valueAxis !== undefined) {
            plotBounds = this._subtractAxis(plotBounds, this.plotArea.valueAxis);
        }
        if (this.plotArea.categoryAxis !== undefined) {
            plotBounds = this._subtractAxis(plotBounds, this.plotArea.categoryAxis);
        }
        this.plotArea.bounds = plotBounds;
        if (this.plotArea.valueAxis !== undefined) {
            this.plotArea.valueAxis.performLayout();
        }
        if (this.plotArea.categoryAxis !== undefined) {
            this.plotArea.categoryAxis.performLayout();
        }
    }
    _layoutLegend(plotBounds, legend) {
        legend.performLayout();
        if (!legend.overlayOnPlot) {
            let left = 0;
            let right = 0;
            let top = 0;
            let bottom = 0;
            switch (legend.position) {
                case ChartAxisPosition.Left:
                    left += legend.bounds.width + ChartLegend.spacing;
                    break;
                case ChartAxisPosition.Right:
                    right += legend.bounds.width + ChartLegend.spacing;
                    break;
                case ChartAxisPosition.Top:
                    top += legend.bounds.height + ChartLegend.spacing;
                    break;
                case ChartAxisPosition.Bottom:
                    bottom += legend.bounds.height + ChartLegend.spacing;
                    break;
            }
            return plotBounds.subtractBorder(left, top, right, bottom);
        }
        // Legend over plot area, no update to plot bounds required.
        return plotBounds;
    }
    _subtractAxis(plotBounds, axis) {
        const distance = axis.getMaxDistanceFromPlot();
        let left = 0;
        let right = 0;
        let top = 0;
        let bottom = 0;
        switch (axis.position) {
            case ChartAxisPosition.Left:
                left += distance;
                break;
            case ChartAxisPosition.Right:
                right += distance;
                break;
            case ChartAxisPosition.Top:
                top += distance;
                break;
            case ChartAxisPosition.Bottom:
                bottom += distance;
                break;
        }
        return plotBounds.subtractBorder(left, top, right, bottom);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtc3BhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2hhcnQvY2hhcnQtc3BhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHaEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ2xELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN6QyxPQUFPLEVBQUUsaUJBQWlCLEVBQWEsTUFBTSxpQkFBaUIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFHckQsTUFBTSxDQUFOLElBQVksU0FFWDtBQUZELFdBQVksU0FBUztJQUNqQix1Q0FBRyxDQUFBO0FBQ1AsQ0FBQyxFQUZXLFNBQVMsS0FBVCxTQUFTLFFBRXBCO0FBRUQsTUFBTSxPQUFPLFVBQVU7SUFVbkI7UUFUUSxhQUFRLEdBQThCLFNBQVMsQ0FBQztRQUNoRCxXQUFNLEdBQTBCLFNBQVMsQ0FBQztRQUMxQyxVQUFLLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQztRQUN2QixVQUFLLEdBQWUsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUNyQyxjQUFTLEdBQVUsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUUvQixXQUFNLEdBQTRCLFNBQVMsQ0FBQztRQUM1QyxXQUFNLEdBQWMsSUFBSSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFHakQseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVB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