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
import { Box } from "../utils/geometry/box.js";
import { Style } from "../text/style.js";
import { ChartAxisPosition } from "./chart-axis.js";
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
        this.textStyle.parStyle.setLineSpacing(240);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtc3BhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2hhcnQvY2hhcnQtc3BhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHaEQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN6QyxPQUFPLEVBQUUsaUJBQWlCLEVBQWEsTUFBTSxpQkFBaUIsQ0FBQztBQU0vRCxNQUFNLENBQU4sSUFBWSxTQUtYO0FBTEQsV0FBWSxTQUFTO0lBQ2pCLHVDQUFHLENBQUE7SUFDSCx5Q0FBSSxDQUFBO0lBQ0oseUNBQUksQ0FBQTtJQUNKLHVDQUFHLENBQUE7QUFDUCxDQUFDLEVBTFcsU0FBUyxLQUFULFNBQVMsUUFLcEI7QUFFRCxNQUFNLE9BQU8sVUFBVTtJQVVuQjtRQVRRLGFBQVEsR0FBOEIsU0FBUyxDQUFDO1FBQ2hELFdBQU0sR0FBMEIsU0FBUyxDQUFDO1FBQzFDLFVBQUssR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO1FBQ3ZCLFVBQUssR0FBZSxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQ3JDLGNBQVMsR0FBVSxJQUFJLEtBQUssRUFBRSxDQUFDO1FBRS9CLFdBQU0sR0FBNEIsU0FBUyxDQUFDO1FBQzVDLFdBQU0sR0FBUSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUdyQyx5QkFBeUI7UUFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVB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