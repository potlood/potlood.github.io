import { Xml } from "../utils/xml.js";
import { BarChart } from "./bar-chart.js";
import { ChartSeries } from "./chart-series.js";
import { ChartValue } from "./chart-value.js";
import { ChartAxis, ChartAxisPosition, ChartAxisTickMode, ChartAxisLabelAlignment, ChartAxisCrossMode } from "./chart-axis.js";
import { ChartStyle } from "./chart-style.js";
import { Metrics } from "../utils/metrics.js";
import { ChartLegend } from "./chart-legend.js";
export class ChartReader {
    static readChartFromNode(chartSpaceNode, space) {
        const chartNode = Xml.getFirstChildOfName(chartSpaceNode, "c:chart");
        if (chartNode !== undefined) {
            chartNode.childNodes.forEach(child => {
                switch (child.nodeName) {
                    case "c:spPr":
                        space.style = this._readStyle(child);
                        break;
                    case "c:plotArea":
                        this._readPlotArea(child, space);
                        break;
                    case "c:legend":
                        this._readLegend(child, space);
                        break;
                }
            });
        }
        return space;
    }
    static _readPlotArea(plotAreaNode, space) {
        plotAreaNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "c:barChart":
                    space.setBarChart(this._readBarChart(child, space));
                    break;
                case "c:catAx":
                    space.plotArea.categoryAxis = this._readChartAxis(child, space, false);
                    break;
                case "c:valAx":
                    space.plotArea.valueAxis = this._readChartAxis(child, space, true);
                    break;
                case "c:spPr":
                    space.plotArea.style = this._readStyle(child);
                    break;
            }
        });
    }
    static _readLegend(legendNode, space) {
        const legend = new ChartLegend(space);
        legendNode.childNodes.forEach((child) => {
            switch (child.nodeName) {
                case "c:spPr":
                    legend.style = this._readStyle(child);
                    break;
                case "c:legendPos":
                    const posAttr = Xml.getAttribute(child, "var");
                    if (posAttr !== undefined) {
                        legend.position = this._parsePosition(posAttr);
                    }
                    break;
                case "c:overlay":
                    const overlay = Xml.getBooleanValueFromNode(child, "var");
                    if (overlay !== undefined) {
                        legend.overlayOnPlot = overlay;
                    }
                    break;
            }
        });
        space.legend = legend;
    }
    static _readBarChart(barChartNode, space) {
        const chart = new BarChart(space);
        barChartNode.childNodes.forEach(child => {
            if (child.nodeName === "c:ser") {
                const series = this._readChartSeries(child);
                chart.series.push(series);
            }
        });
        return chart;
    }
    static _readStyle(styleNode) {
        const style = new ChartStyle();
        styleNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "a:noFill":
                    style.fillColor = undefined;
                    break;
                case "a:solidFill":
                    style.fillColor = this._readFillColor(child);
                    break;
                case "a:ln":
                    const firstChild = child.firstChild;
                    if (firstChild !== null) {
                        style.lineColor = this._readFillColor(firstChild);
                    }
                    break;
            }
        });
        return style;
    }
    static _readChartAxis(axisNode, space, isValueAxis) {
        let pos = ChartAxisPosition.Bottom;
        let style = new ChartStyle;
        let majorTickMode = ChartAxisTickMode.None;
        let minorTickMode = ChartAxisTickMode.None;
        let majorGridStyle = new ChartStyle();
        let minorGridStyle = new ChartStyle();
        let labelAlignment = ChartAxisLabelAlignment.Center;
        let crossMode = ChartAxisCrossMode.AutoZero;
        let labelOffset = 0;
        axisNode.childNodes.forEach(child => {
            let valAttr = undefined;
            switch (child.nodeName) {
                case "c:spPr":
                    style = this._readStyle(child);
                    break;
                case "c:majorTickMark":
                    valAttr = Xml.getAttribute(child, "val");
                    if (valAttr !== undefined) {
                        majorTickMode = this._parseTickMode(valAttr);
                    }
                    break;
                case "c:minorTickMark":
                    valAttr = Xml.getAttribute(child, "val");
                    if (valAttr !== undefined) {
                        minorTickMode = this._parseTickMode(valAttr);
                    }
                    break;
                case "c:majorGridlines":
                    if (child.firstChild !== null) {
                        majorGridStyle = this._readStyle(child.firstChild);
                    }
                    break;
                case "c:minorGridlines":
                    if (child.firstChild !== null) {
                        minorGridStyle = this._readStyle(child.firstChild);
                    }
                    break;
                case "c:axPos":
                    valAttr = Xml.getAttribute(child, "val");
                    if (valAttr !== undefined) {
                        pos = this._parsePosition(valAttr);
                    }
                    break;
                case "c:lblAlgn":
                    valAttr = Xml.getAttribute(child, "val");
                    if (valAttr !== undefined) {
                        labelAlignment = this._parseLabelAlignment(valAttr);
                    }
                    break;
                case "c:lblOffset":
                    valAttr = Xml.getAttribute(child, "val");
                    if (valAttr !== undefined) {
                        labelOffset = Metrics.convertTwipsToPixels(parseInt(valAttr, 10));
                    }
                    break;
                case "c:crosses":
                    valAttr = Xml.getAttribute(child, "val");
                    if (valAttr !== undefined) {
                        crossMode = this._parseCrossMode(valAttr);
                    }
                    break;
            }
        });
        const axis = new ChartAxis(space, style, pos, majorTickMode, minorTickMode, labelOffset, isValueAxis);
        axis.labelAlignment = labelAlignment;
        axis.crossMode = crossMode;
        axis.majorGridStyle = majorGridStyle;
        axis.minorGridStyle = minorGridStyle;
        return axis;
    }
    static _readChartSeries(seriesNode) {
        const series = new ChartSeries();
        const nameNode = Xml.getFirstChildOfName(seriesNode, "c:tx");
        if (nameNode !== undefined && nameNode.firstChild !== null) {
            const names = this._readStringReference(nameNode.firstChild);
            series.name = names[0];
        }
        const catNode = Xml.getFirstChildOfName(seriesNode, "c:cat");
        if (catNode !== undefined) {
            if (catNode.firstChild !== null) {
                const refName = catNode.firstChild.nodeName;
                if (refName === "c:strRef") {
                    const stringCats = this._readStringReference(catNode.firstChild);
                    stringCats.forEach(stringCat => {
                        const cat = new ChartValue();
                        cat.text = stringCat;
                        series.categories.push(cat);
                    });
                }
                else if (refName === "c:numRef") {
                    const numValues = this._readNumericReference(catNode.firstChild);
                    numValues.forEach(numValue => {
                        const cat = new ChartValue();
                        cat.numeric = numValue;
                        series.categories.push(cat);
                    });
                }
                else {
                    console.log(`Don't know how to parse Chart Category from node: ${refName}`);
                }
            }
        }
        const valNode = Xml.getFirstChildOfName(seriesNode, "c:val");
        if (valNode !== undefined) {
            if (valNode.firstChild !== null) {
                const refName = valNode.firstChild.nodeName;
                if (refName === "c:strRef") {
                    const stringValues = this._readStringReference(valNode.firstChild);
                    stringValues.forEach(stringValue => {
                        const val = new ChartValue();
                        val.text = stringValue;
                        series.values.push(val);
                    });
                }
                else if (refName === "c:numRef") {
                    const numValues = this._readNumericReference(valNode.firstChild);
                    numValues.forEach(numValue => {
                        const val = new ChartValue();
                        val.numeric = numValue;
                        series.values.push(val);
                    });
                }
                else {
                    console.log(`Don't know how to parse Chart Value from node: ${refName}`);
                }
            }
        }
        const chartStyleNode = Xml.getFirstChildOfName(seriesNode, "c:spPr");
        if (chartStyleNode !== undefined) {
            const fillNode = Xml.getFirstChildOfName(chartStyleNode, "a:solidFill");
            if (fillNode !== undefined) {
                const colorNode = Xml.getFirstChildOfName(fillNode, "a:srgbClr");
                if (colorNode !== undefined) {
                    const color = Xml.getAttribute(colorNode, "val");
                    if (color !== undefined) {
                        series.color = color;
                    }
                }
            }
        }
        return series;
    }
    static _readStringReference(strRefNode) {
        const ref = [];
        const strCacheNode = Xml.getFirstChildOfName(strRefNode, "c:strCache");
        if (strCacheNode !== undefined) {
            strCacheNode.childNodes.forEach(node => {
                if (node.nodeName === "c:pt") {
                    const index = Xml.getAttribute(node, "idx");
                    const valueNode = Xml.getFirstChildOfName(node, "c:v");
                    if (index !== undefined && valueNode !== undefined && valueNode.textContent !== null) {
                        ref[parseInt(index, 10)] = valueNode.textContent;
                    }
                }
            });
        }
        return ref;
    }
    static _readNumericReference(numRefNode) {
        const ref = [];
        const numCacheNode = Xml.getFirstChildOfName(numRefNode, "c:numCache");
        if (numCacheNode !== undefined) {
            numCacheNode.childNodes.forEach(node => {
                if (node.nodeName === "c:pt") {
                    const index = Xml.getAttribute(node, "idx");
                    const valueNode = Xml.getFirstChildOfName(node, "c:v");
                    if (index !== undefined && valueNode !== undefined && valueNode.textContent !== null) {
                        ref[parseInt(index, 10)] = parseFloat(valueNode.textContent);
                    }
                }
            });
        }
        return ref;
    }
    static _readFillColor(fillNode) {
        let color = "ffffff";
        const colorNode = fillNode.firstChild;
        if (colorNode !== null && colorNode.nodeName === "a:srgbClr") {
            const valAttr = Xml.getAttribute(colorNode, "val");
            if (valAttr !== undefined) {
                color = valAttr;
            }
        }
        return color;
    }
    static _parseTickMode(tickAttr) {
        let tickMode = ChartAxisTickMode.None;
        if (tickAttr === "out") {
            tickMode = ChartAxisTickMode.Outwards;
        }
        return tickMode;
    }
    static _parsePosition(posAttr) {
        let posMode = ChartAxisPosition.Bottom;
        switch (posAttr) {
            case "t":
                posMode = ChartAxisPosition.Top;
                break;
            case "b":
                posMode = ChartAxisPosition.Bottom;
                break;
            case "l":
                posMode = ChartAxisPosition.Left;
                break;
            case "r":
                posMode = ChartAxisPosition.Right;
                break;
        }
        return posMode;
    }
    static _parseLabelAlignment(_alignAttr) {
        return ChartAxisLabelAlignment.Center;
    }
    static _parseCrossMode(_crossAttr) {
        return ChartAxisCrossMode.AutoZero;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtcmVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYXJ0L2NoYXJ0LXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFdEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBRSx1QkFBdUIsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9ILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRWhELE1BQU0sT0FBTyxXQUFXO0lBQ2IsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGNBQW9CLEVBQUUsS0FBaUI7UUFDbkUsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNyRSxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDekIsU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2pDLFFBQVEsS0FBSyxDQUFDLFFBQVEsRUFBRTtvQkFDcEIsS0FBSyxRQUFRO3dCQUNULEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDckMsTUFBTTtvQkFDVixLQUFLLFlBQVk7d0JBQ2IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFL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