import { ChartStyle } from "./chart-style.js";
import { ChartAxisPosition } from "./chart-axis.js";
import { Box } from "../utils/geometry/box.js";
import { FontMetrics } from "../utils/font-metrics.js";
import { InSequence } from "../utils/in-sequence.js";
export class ChartLegend {
    constructor(space) {
        this.style = new ChartStyle();
        this.position = ChartAxisPosition.Right;
        this.overlayOnPlot = false;
        this.onlySeries = undefined;
        this.bounds = new Box(0, 0, 0, 0);
        this.space = space;
    }
    get widgetSize() {
        return ChartLegend._widgetSize;
    }
    get widgetSpacing() {
        return ChartLegend._widgetSpacing;
    }
    getLines() {
        const lines = [];
        const textStyle = this.space.textStyle;
        const x = this.bounds.x + ChartLegend._widgetSize + ChartLegend._widgetSpacing;
        let y = this.bounds.y + FontMetrics.getTopToBaseline(textStyle);
        this._getNames().forEach(name => {
            lines.push({
                text: name,
                x: x,
                y: y,
                width: this.bounds.width,
                stretched: false,
                following: false,
                color: textStyle.color,
                fontFamily: textStyle.fontFamily,
                fontSize: textStyle.fontSize,
                emphasis: textStyle.emphasis
            });
            y += textStyle.lineSpacing;
        });
        return lines;
    }
    performLayout() {
        const size = this._getSize();
        const spaceBounds = this.space.bounds;
        let xPos = InSequence.Last;
        let yPos = InSequence.Middle;
        switch (this.position) {
            case ChartAxisPosition.Left:
                xPos = InSequence.First;
                yPos = InSequence.Middle;
                break;
            case ChartAxisPosition.Right:
                xPos = InSequence.Last;
                yPos = InSequence.Middle;
                break;
            case ChartAxisPosition.Top:
                xPos = InSequence.Middle;
                yPos = InSequence.First;
                break;
            case ChartAxisPosition.Right:
                xPos = InSequence.Middle;
                yPos = InSequence.Last;
                break;
        }
        this.bounds = spaceBounds.subtractSpacing(ChartLegend.spacing).placeInRectangle(size.width, size.height, xPos, yPos);
    }
    getColors() {
        let colors;
        if (this.onlySeries === undefined) {
            colors = this.space.chart.series.map((series) => series.style.lineColor || series.style.fillColor || "000000");
        }
        else {
            colors = this.space.chart.series[this.onlySeries].categories.map((cat) => {
                let color = "000000";
                if (cat.style !== undefined) {
                    color = cat.style.lineColor || cat.style.fillColor || "000000";
                }
                return color;
            });
        }
        return colors;
    }
    _getNames() {
        let names;
        if (this.onlySeries === undefined) {
            names = this.space.chart.series.map((series) => series.name);
        }
        else {
            names = this.space.chart.series[this.onlySeries].categories.map((cat) => cat.text || "");
        }
        return names;
    }
    _getSize() {
        const charWidth = FontMetrics.averageCharWidth(this.space.textStyle);
        let maxChars = 0;
        const names = this._getNames();
        names.forEach(name => {
            maxChars = Math.max(maxChars, name.length);
        });
        const lineSpacing = this.space.textStyle.lineSpacing;
        const height = names.length * lineSpacing;
        const textWidth = (maxChars + 1) * charWidth;
        const widgetWidth = ChartLegend._widgetSize + ChartLegend._widgetSpacing;
        return { width: textWidth + widgetWidth, height: height };
    }
}
ChartLegend._widgetSize = 10;
ChartLegend._widgetSpacing = 5;
ChartLegend.spacing = 5;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtbGVnZW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYXJ0L2NoYXJ0LWxlZ2VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFHckQsTUFBTSxPQUFPLFdBQVc7SUFXcEIsWUFBWSxLQUFpQjtRQVR0QixVQUFLLEdBQWUsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUNyQyxhQUFRLEdBQXNCLGlCQUFpQixDQUFDLEtBQUssQ0FBQztRQUN0RCxrQkFBYSxHQUFZLEtBQUssQ0FBQztRQUMvQixlQUFVLEdBQXVCLFNBQVMsQ0FBQztRQUMzQyxXQUFNLEdBQVEsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFNckMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQVcsVUFBVTtRQUNqQixPQUFPLFdBQVcsQ0FBQyxXQUFXLENBQUM7SUFDbkMsQ0FBQztJQUVELElBQVcsYUFBYTtRQUNwQixPQUFPLFdBQVcsQ0FBQyxjQUFjLENBQUM7SUFDdEMsQ0FBQztJQUVNLFFBQVE7UUFDWCxNQUFNLEtBQUssR0FBMEIsRUFBRSxDQUFDO1FBQ3hDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxX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