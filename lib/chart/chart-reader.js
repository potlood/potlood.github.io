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
                    space.plotArea.categoryAxis = this._readChartAxis(child);
                    break;
                case "c:valAx":
                    space.plotArea.valueAxis = this._readChartAxis(child);
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
    static _readChartAxis(axisNode) {
        let pos = ChartAxisPosition.Bottom;
        let majorTickMode = ChartAxisTickMode.None;
        let minorTickMode = ChartAxisTickMode.None;
        let labelAlignment = ChartAxisLabelAlignment.Center;
        let crossMode = ChartAxisCrossMode.AutoZero;
        let labelOffset = 0;
        axisNode.childNodes.forEach(child => {
            let valAttr = undefined;
            switch (child.nodeName) {
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
        const axis = new ChartAxis(pos, majorTickMode, minorTickMode, labelOffset);
        axis.labelAlignment = labelAlignment;
        axis.crossMode = crossMode;
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