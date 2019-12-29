import { Xml } from "../utils/xml.js";
import { ChartType } from "./chart-space.js";
import { BarChart } from "./bar-chart.js";
import { ChartSeries } from "./chart-series.js";
import { ChartValue } from "./chart-value.js";
import { ChartAxis, ChartAxisPosition, ChartAxisTickMode, ChartAxisLabelAlignment, ChartAxisCrossMode } from "./chart-axis.js";
import { ChartStyle } from "./chart-style.js";
import { Metrics } from "../utils/metrics.js";
import { ChartLegend } from "./chart-legend.js";
import { LineChart } from "./line-chart.js";
import { AreaChart } from "./area-chart.js";
import { PieChart } from "./pie-chart.js";
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
                case "c:areaChart":
                    space.setAreaChart(this._readAreaChart(child, space));
                    break;
                case "c:lineChart":
                    space.setLineChart(this._readLineChart(child, space));
                    break;
                case "c:barChart":
                    space.setBarChart(this._readBarChart(child, space));
                    break;
                case "c:pieChart":
                    space.setPieChart(this._readPieChart(child, space));
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
        // Pie chart shows series 0 by default.
        if (space.chartType === ChartType.Pie) {
            legend.onlySeries = 0;
        }
        space.legend = legend;
    }
    static _readAreaChart(lineChartNode, space) {
        const chart = new AreaChart(space);
        lineChartNode.childNodes.forEach(child => {
            if (child.nodeName === "c:ser") {
                const series = this._readChartSeries(child);
                chart.series.push(series);
            }
        });
        return chart;
    }
    static _readLineChart(lineChartNode, space) {
        const chart = new LineChart(space);
        lineChartNode.childNodes.forEach(child => {
            if (child.nodeName === "c:ser") {
                const series = this._readChartSeries(child);
                chart.series.push(series);
            }
        });
        return chart;
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
    static _readPieChart(pieChartNode, space) {
        const chart = new PieChart(space);
        pieChartNode.childNodes.forEach(child => {
            if (child.nodeName === "c:ser") {
                const series = this._readChartSeries(child);
                chart.series.push(series);
            }
            if (child.nodeName === "c:firstSliceAngle") {
                const angleAttr = Xml.getAttribute(child, "val");
                if (angleAttr !== undefined) {
                    chart.startAngle = parseInt(angleAttr);
                }
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
        const catStyles = [];
        seriesNode.childNodes.forEach((child) => {
            const firstChild = child.firstChild;
            switch (child.nodeName) {
                case "c:tx":
                    if (firstChild !== null) {
                        const names = this._readStringReference(firstChild);
                        series.name = names[0];
                    }
                    break;
                case "c:cat":
                    if (firstChild !== null) {
                        const refName = firstChild.nodeName;
                        if (refName === "c:strRef") {
                            const stringCats = this._readStringReference(firstChild);
                            stringCats.forEach(stringCat => {
                                const cat = new ChartValue();
                                cat.text = stringCat;
                                series.categories.push(cat);
                            });
                        }
                        else if (refName === "c:numRef") {
                            const numValues = this._readNumericReference(firstChild);
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
                    break;
                case "c:val":
                    if (firstChild !== null) {
                        const refName = firstChild.nodeName;
                        if (refName === "c:strRef") {
                            const stringValues = this._readStringReference(firstChild);
                            stringValues.forEach(stringValue => {
                                const val = new ChartValue();
                                val.text = stringValue;
                                series.values.push(val);
                            });
                        }
                        else if (refName === "c:numRef") {
                            const numValues = this._readNumericReference(firstChild);
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
                    break;
                case "c:spPr":
                    series.style = this._readStyle(child);
                    break;
                case "c:dPt":
                    const index = Xml.getNumberValueFromNode(child, "c:idx");
                    const styleNode = Xml.getFirstChildOfName(child, "c:spPr");
                    if (index !== undefined && styleNode !== undefined) {
                        catStyles[index] = this._readStyle(styleNode);
                    }
                    break;
                case "c:idx":
                case "c:order":
                case "c:invertIfNegative":
                case "c:dLbls":
                case "c:marker":
                case "c:smooth":
                case "c:explosion":
                    // Ignore
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Chart Series reading.`);
                    break;
            }
        });
        catStyles.forEach((style, i) => {
            series.categories[i].style = style;
        });
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
        let color = undefined;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtcmVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYXJ0L2NoYXJ0LXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdEMsT0FBTyxFQUFjLFNBQVMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDaEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUUsdUJBQXVCLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDNUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUUxQyxNQUFNLE9BQU8sV0FBVztJQUNiLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxjQUFvQixFQUFFLEtBQWlCO1FBQ25FLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDckUsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO1lBQ3pCLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxF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