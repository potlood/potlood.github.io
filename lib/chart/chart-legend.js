import { ChartStyle } from "./chart-style.js";
import { ChartAxisPosition } from "./chart-axis.js";
import { Rectangle } from "../utils/rectangle.js";
import { FontMetrics } from "../utils/font-metrics.js";
import { InSequence } from "../utils/in-sequence.js";
export class ChartLegend {
    constructor(space) {
        this.style = new ChartStyle();
        this.position = ChartAxisPosition.Right;
        this.overlayOnPlot = false;
        this.bounds = new Rectangle(0, 0, 0, 0);
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
                fitWidth: false,
                following: false,
                inRun: InSequence.Only
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
        return this.space.chart.series.map((series) => series.color);
    }
    _getNames() {
        return this.space.chart.series.map((series) => series.name);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtbGVnZW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYXJ0L2NoYXJ0LWxlZ2VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRWxELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFHckQsTUFBTSxPQUFPLFdBQVc7SUFVcEIsWUFBWSxLQUFpQjtRQVJ0QixVQUFLLEdBQWUsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUNyQyxhQUFRLEdBQXNCLGlCQUFpQixDQUFDLEtBQUssQ0FBQztRQUN0RCxrQkFBYSxHQUFZLEtBQUssQ0FBQztRQUMvQixXQUFNLEdBQWMsSUFBSSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFNakQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQVcsVUFBVTtRQUNqQixPQUFPLFdBQVcsQ0FBQyxXQUFXLENBQUM7SUFDbkMsQ0FBQztJQUVELElBQVcsYUFBYTtRQUNwQixPQUFPLFdBQVcsQ0FBQyxjQUFjLENBQUM7SUFDdEMsQ0FBQztJQUVNLFFBQVE7UUFDWCxNQUFNLEtBQUssR0FBMEIsRUFBRSxDQUFDO1FBQ3hDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FB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