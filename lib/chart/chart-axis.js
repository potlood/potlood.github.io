import { FontMetrics } from "../utils/font-metrics.js";
import { ChartStyle } from "./chart-style.js";
import { InSequence } from "../utils/in-sequence.js";
import { Justification } from "../paragraph/par-style.js";
export var ChartAxisPosition;
(function (ChartAxisPosition) {
    ChartAxisPosition[ChartAxisPosition["Top"] = 0] = "Top";
    ChartAxisPosition[ChartAxisPosition["Bottom"] = 1] = "Bottom";
    ChartAxisPosition[ChartAxisPosition["Left"] = 2] = "Left";
    ChartAxisPosition[ChartAxisPosition["Right"] = 3] = "Right";
})(ChartAxisPosition || (ChartAxisPosition = {}));
export var ChartAxisTickMode;
(function (ChartAxisTickMode) {
    ChartAxisTickMode[ChartAxisTickMode["None"] = 0] = "None";
    ChartAxisTickMode[ChartAxisTickMode["Outwards"] = 1] = "Outwards";
})(ChartAxisTickMode || (ChartAxisTickMode = {}));
export var ChartAxisLabelAlignment;
(function (ChartAxisLabelAlignment) {
    ChartAxisLabelAlignment[ChartAxisLabelAlignment["Center"] = 0] = "Center";
})(ChartAxisLabelAlignment || (ChartAxisLabelAlignment = {}));
export var ChartAxisCrossMode;
(function (ChartAxisCrossMode) {
    ChartAxisCrossMode[ChartAxisCrossMode["AutoZero"] = 0] = "AutoZero";
})(ChartAxisCrossMode || (ChartAxisCrossMode = {}));
export class ChartAxis {
    constructor(space, style, pos, major, minor, offset, isValueAxis) {
        this.labelAlignment = ChartAxisLabelAlignment.Center;
        this.crossMode = ChartAxisCrossMode.AutoZero;
        this.positionedTexts = undefined;
        this.positionedLines = undefined;
        this._space = space;
        this.style = style;
        this.position = pos;
        this.majorTickMode = major;
        this.minorTickMode = minor;
        this.labelOffset = offset;
        this.majorGridStyle = new ChartStyle();
        this.minorGridStyle = new ChartStyle();
        this._isValueAxis = isValueAxis;
    }
    get isValueAxis() {
        return this._isValueAxis;
    }
    get isCategoryAxis() {
        return !this._isValueAxis;
    }
    getMaxDistanceFromPlot() {
        let maxDistance;
        if (this.position === ChartAxisPosition.Bottom || this.position === ChartAxisPosition.Top) {
            maxDistance = ChartAxis._labelSpacing + this._space.textStyle.lineSpacing;
        }
        else {
            let maxChars = 0;
            this._getTexts().forEach(text => {
                maxChars = Math.max(maxChars, text.length);
            });
            maxDistance = maxChars * FontMetrics.averageCharWidth(this._space.textStyle);
            maxDistance += ChartAxis._labelSpacing;
        }
        if (this.majorTickMode === ChartAxisTickMode.Outwards) {
            maxDistance += ChartAxis._majorOutwardLength;
        }
        else if (this.minorTickMode === ChartAxisTickMode.Outwards) {
            maxDistance += ChartAxis._minorOutwardLength;
        }
        return maxDistance;
    }
    performLayout() {
        this.positionedTexts = [];
        this.positionedLines = [];
        const textLines = this.positionedTexts;
        const lines = this.positionedLines;
        const plotBounds = this._space.plotArea.bounds;
        const hasNumericValues = this._hasNumericValues();
        switch (this.position) {
            case ChartAxisPosition.Left:
                if (hasNumericValues) {
                    const { min, max } = this._space.chart.getValueRange();
                    const texts = this._getMajorValues(min, max).reverse();
                    const halfLineSpacing = this._space.textStyle.lineSpacing / 2;
                    const segmentHeight = plotBounds.height / (texts.length - 1);
                    let currentY = plotBounds.top;
                    let textX = plotBounds.left - ChartAxis._labelSpacing;
                    let lineX1 = plotBounds.left;
                    let lineX2 = plotBounds.left;
                    if (this.majorTickMode === ChartAxisTickMode.Outwards) {
                        textX -= ChartAxis._majorOutwardLength;
                        lineX2 -= ChartAxis._majorOutwardLength;
                    }
                    else if (this.minorTickMode === ChartAxisTickMode.Outwards) {
                        textX -= ChartAxis._minorOutwardLength;
                        lineX2 -= ChartAxis._minorOutwardLength;
                    }
                    if (this.majorGridStyle.lineColor !== undefined) {
                        lineX1 = plotBounds.right;
                    }
                    texts.forEach(text => {
                        textLines.push(this._createPositionedText(textX, currentY + halfLineSpacing, text, Justification.right));
                        lines.push({
                            x1: lineX1,
                            x2: lineX2,
                            y1: currentY,
                            y2: currentY
                        });
                        currentY += segmentHeight;
                    });
                }
                break;
            case ChartAxisPosition.Right:
                break;
            case ChartAxisPosition.Top:
                break;
            case ChartAxisPosition.Bottom:
                if (!hasNumericValues) {
                    const texts = this._getTexts();
                    const halfSegmentWidth = (plotBounds.width / texts.length) / 2;
                    let currentX = plotBounds.x;
                    let textY = plotBounds.bottom + ChartAxis._labelSpacing + FontMetrics.getTopToBaseline(this._space.textStyle);
                    let lineY1 = plotBounds.bottom;
                    let lineY2 = plotBounds.bottom;
                    if (this.majorTickMode === ChartAxisTickMode.Outwards) {
                        textY += ChartAxis._majorOutwardLength;
                        lineY2 += ChartAxis._majorOutwardLength;
                    }
                    else if (this.minorTickMode === ChartAxisTickMode.Outwards) {
                        textY += ChartAxis._minorOutwardLength;
                        lineY2 += ChartAxis._minorOutwardLength;
                    }
                    if (this.majorGridStyle.lineColor !== undefined) {
                        lineY1 = plotBounds.top;
                    }
                    texts.forEach(text => {
                        textLines.push(this._createPositionedText(currentX + halfSegmentWidth, textY, text));
                        lines.push({
                            x1: currentX,
                            x2: currentX,
                            y1: lineY1,
                            y2: lineY2
                        });
                        currentX += 2 * halfSegmentWidth;
                    });
                    lines.push({
                        x1: currentX,
                        x2: currentX,
                        y1: lineY1,
                        y2: lineY2
                    });
                }
                break;
        }
    }
    _hasNumericValues() {
        const chart = this._space.chart;
        return (this.isValueAxis) ? chart.series[0].hasNumericValues : chart.series[0].hasNumericCategories;
    }
    _getTexts() {
        const { min, max } = this._space.chart.getValueRange();
        return (this.isValueAxis) ? this._getMajorValues(min, max) : this._getCategoryNames();
    }
    _getCategoryNames() {
        return this._space.chart.series[0].categories.map(cat => {
            return cat.toString();
        });
    }
    _getMajorValues(min, max) {
        const texts = [];
        const delta = (max - min) / ChartAxis._numMajorTicks;
        for (let i = min; i <= max; i += delta) {
            texts.push(i.toString());
        }
        return texts;
    }
    _createPositionedText(x, y, text, justification) {
        return {
            text: text,
            x: x,
            y: y,
            width: 0,
            fitWidth: false,
            following: false,
            inRun: InSequence.Only,
            justification: justification
        };
    }
}
ChartAxis._labelSpacing = 5;
ChartAxis._majorOutwardLength = 5;
ChartAxis._minorOutwardLength = 5;
ChartAxis._numMajorTicks = 6;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtYXhpcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jaGFydC9jaGFydC1heGlzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUUxRCxNQUFNLENBQU4sSUFBWSxpQkFLWDtBQUxELFdBQVksaUJBQWlCO0lBQ3pCLHVEQUFHLENBQUE7SUFDSCw2REFBTSxDQUFBO0lBQ04seURBQUksQ0FBQTtJQUNKLDJEQUFLLENBQUE7QUFDVCxDQUFDLEVBTFcsaUJBQWlCLEtBQWpCLGlCQUFpQixRQUs1QjtBQUVELE1BQU0sQ0FBTixJQUFZLGlCQUdYO0FBSEQsV0FBWSxpQkFBaUI7SUFDekIseURBQUksQ0FBQTtJQUNKLGlFQUFRLENBQUE7QUFDWixDQUFDLEVBSFcsaUJBQWlCLEtBQWpCLGlCQUFpQixRQUc1QjtBQUVELE1BQU0sQ0FBTixJQUFZLHVCQUVYO0FBRkQsV0FBWSx1QkFBdUI7SUFDL0IseUVBQU0sQ0FBQTtBQUNWLENBQUMsRUFGVyx1QkFBdUIsS0FBdkIsdUJBQXVCLFFBRWxDO0FBRUQsTUFBTSxDQUFOLElBQVksa0JBRVg7QUFGRCxXQUFZLGtCQUFrQjtJQUMxQixtRUFBUSxDQUFBO0FBQ1osQ0FBQyxFQUZXLGtCQUFrQixLQUFsQixrQkFBa0IsUUFFN0I7QUFFRCxNQUFNLE9BQU8sU0FBUztJQW1CbEIsWUFBWSxLQUFpQixFQUFFLEtBQWlCLEVBQUUsR0FBc0IsRUFBRSxLQUF3QixFQUFFLEtBQXdCLEVBQUUsTUFBYyxFQUFFLFdBQW9CO1FBYjNKLG1CQUFjLEdBQTRCLHVCQUF1QixDQUFDLE1BQU0s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