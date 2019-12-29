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
import { Box } from "../math/box.js";
import { Style } from "../text/style.js";
import { ChartAxisPosition } from "./chart-axis.js";
import { LineRule } from "../paragraph/par-style.js";
export var ChartType;
(function (ChartType) {
    ChartType[ChartType["Bar"] = 0] = "Bar";
    ChartType[ChartType["Line"] = 1] = "Line";
    ChartType[ChartType["Area"] = 2] = "Area";
    ChartType[ChartType["Pie"] = 3] = "Pie";
})(ChartType || (ChartType = {}));
export class ChartSpace {
    constructor() {
        this._promise = undefined;
        this._chart = undefined;
        this._type = ChartType.Bar;
        this.style = new ChartStyle();
        this.textStyle = new Style();
        this.legend = undefined;
        this.bounds = new Box(0, 0, 0, 0);
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
    setAreaChart(areaChart) {
        this._chart = areaChart;
        this._type = ChartType.Area;
    }
    setLineChart(lineChart) {
        this._chart = lineChart;
        this._type = ChartType.Line;
    }
    setBarChart(barChart) {
        this._chart = barChart;
        this._type = ChartType.Bar;
    }
    setPieChart(pieChart) {
        this._chart = pieChart;
        this._type = ChartType.Pie;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtc3BhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2hhcnQvY2hhcnQtc3BhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHaEQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN6QyxPQUFPLEVBQUUsaUJBQWlCLEVBQWEsTUFBTSxpQkFBaUIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFNckQsTUFBTSxDQUFOLElBQVksU0FLWDtBQUxELFdBQVksU0FBUztJQUNqQix1Q0FBRyxDQUFBO0lBQ0gseUNBQUksQ0FBQTtJQUNKLHlDQUFJLENBQUE7SUFDSix1Q0FBRyxDQUFBO0FBQ1AsQ0FBQyxFQUxXLFNBQVMsS0FBVCxTQUFTLFFBS3BCO0FBRUQsTUFBTSxPQUFPLFVBQVU7SUFVbkI7UUFUUSxhQUFRLEdBQThCLFNBQVMsQ0FBQztRQUNoRCxXQUFNLEdBQTBCLFNBQVMsQ0FBQztRQUMxQyxVQUFLLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQztRQUN2QixVQUFLLEdBQWUsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUNyQyxjQUFTLEdBQVUsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUUvQixXQUFNLEdBQTRCLFNBQVMsQ0FBQztRQUM1QyxXQUFNLEdBQVEsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFHckMseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxTQUFT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