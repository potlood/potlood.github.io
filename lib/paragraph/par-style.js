import { Xml } from "../utils/xml.js";
import { Metrics } from "../utils/metrics.js";
import { Style } from "../text/style.js";
import { NumberingStyle } from "../numbering/num-style.js";
import { TabStop } from "./tab-stop.js";
import { RunStyle } from "../text/run-style.js";
export var Justification;
(function (Justification) {
    Justification["center"] = "center";
    Justification["both"] = "both";
    Justification["left"] = "left";
    Justification["right"] = "right";
})(Justification || (Justification = {}));
export var LineRule;
(function (LineRule) {
    LineRule["exactly"] = "exactly";
    LineRule["atLeast"] = "atLeast";
    LineRule["auto"] = "auto";
})(LineRule || (LineRule = {}));
export class ParStyle {
    constructor() {
        this.justification = undefined;
    }
    static fromParPresentationNode(parPresentationNode) {
        const parStyle = new ParStyle();
        parPresentationNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "w:pStyle":
                    parStyle._basedOnId = Xml.getStringValue(child);
                    break;
                case "w:jc":
                    const justification = Xml.getStringValue(child);
                    if (justification !== undefined) {
                        parStyle.justification = Justification[justification];
                    }
                    break;
                case "w:ind":
                    const hangingAttr = Xml.getAttribute(child, "w:hanging");
                    if (hangingAttr !== undefined) {
                        parStyle.hanging = Metrics.convertTwipsToPixels(parseInt(hangingAttr, 10));
                    }
                    const leftAttr = Xml.getAttribute(child, "w:left");
                    if (leftAttr !== undefined) {
                        parStyle.indentation = Metrics.convertTwipsToPixels(parseInt(leftAttr, 10));
                    }
                    break;
                case "w:numPr":
                    parStyle.numStyle = NumberingStyle.fromNumPresentationNode(child);
                    break;
                case "w:spacing":
                    parStyle.setLineSpacingFromNode(child);
                    parStyle.setParSpacingFromNode(child);
                    break;
                case "w:shd":
                    parStyle.shadingColor = Style.readShading(child);
                    break;
                case "w:tabs":
                    parStyle.tabStops = TabStop.fromTabsNode(child);
                    break;
                case "w:rPr":
                    parStyle.runStyle = RunStyle.fromPresentationNode(child);
                    break;
                case "w:widowControl":
                case "w:snapToGrid":
                case "w:sectPr":
                case "w:pBdr":
                case "w:contextualSpacing":
                case "w:keepLines":
                case "w:bidi":
                case "w:keepNext":
                case "w:suppressAutoHyphens":
                case "w:suppressLineNumbers":
                case "w:outlineLvl":
                    // Ignore
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during ParStyle reading.`);
                    break;
            }
        });
        return parStyle;
    }
    getLineSpacing(style) {
        let spacing = this._lineSpacing;
        if (spacing !== undefined) {
            const lineRule = this._lineRule;
            switch (lineRule) {
                case LineRule.auto:
                    // Line Spacing is interpreted as 1/240th of a line.
                    const lineSize = style.fontSize * 1.08;
                    spacing = lineSize * spacing / 240;
                    break;
                default:
                    // Line spacing is interpreted as 1/20th of a point.
                    spacing = Metrics.convertTwipsToPixels(spacing);
                    break;
            }
        }
        return spacing;
    }
    setLineSpacing(spacing) {
        this._lineSpacing = spacing;
        this._lineRule = LineRule.atLeast;
    }
    get spacingBefore() {
        let spacing = 0;
        if (this._parLinesBefore !== undefined && this._lineSpacing !== undefined) {
            spacing = this._parLinesBefore * this._lineSpacing;
        }
        else if (this._parSpacingBefore !== undefined) {
            spacing = this._parSpacingBefore;
        }
        else if (this._parAutoSpacingBefore === true && this._lineSpacing !== undefined) {
            spacing = 1.08 * this._lineSpacing;
        }
        return spacing;
    }
    get spacingAfter() {
        let spacing = 0;
        if (this._parLinesAfter !== undefined && this._lineSpacing !== undefined) {
            spacing = this._parLinesAfter * this._lineSpacing;
        }
        else if (this._parSpacingAfter !== undefined) {
            spacing = this._parSpacingAfter;
        }
        else if (this._parAutoSpacingAfter === true && this._lineSpacing !== undefined) {
            spacing = 1.08 * this._lineSpacing;
        }
        return spacing;
    }
    applyNamedStyles(namedStyles) {
        if (this._basedOnId !== undefined && namedStyles !== undefined) {
            const baseStyle = namedStyles.getNamedStyle(this._basedOnId);
            if (baseStyle !== undefined) {
                this.basedOn = baseStyle;
            }
        }
    }
    applyNumberings(numberings) {
        if (this.numStyle !== undefined) {
            this.numStyle.applyNumberings(numberings);
        }
    }
    clone() {
        const cloned = new ParStyle();
        cloned.basedOn = this.basedOn;
        cloned._basedOnId = this._basedOnId;
        cloned.justification = this.justification;
        cloned.indentation = this.indentation;
        cloned.hanging = this.hanging;
        cloned._lineSpacing = this._lineSpacing;
        cloned._lineRule = this._lineRule;
        cloned.numStyle = this.numStyle;
        cloned.shadingColor = this.shadingColor;
        cloned._parSpacingBefore = this._parSpacingBefore;
        cloned._parSpacingAfter = this._parSpacingAfter;
        cloned._parLinesBefore = this._parLinesBefore;
        cloned._parLinesAfter = this._parLinesAfter;
        cloned._parAutoSpacingBefore = this._parAutoSpacingBefore;
        cloned._parAutoSpacingAfter = this._parAutoSpacingAfter;
        cloned.tabStops = this.tabStops;
        return cloned;
    }
    toString() {
        const baseText = (this._basedOnId !== undefined) ? `base=${this._basedOnId}` : "";
        const justText = (this.justification !== undefined) ? `jc=${this.justification.toString()}` : "";
        const indText = (this.indentation !== undefined) ? `ind=${this.indentation.toString()}` : "";
        const lineText = (this._lineSpacing !== undefined) ? `line=${this._lineSpacing.toString()}` : "";
        return `ParStyle: ${baseText} ${justText} ${indText} ${lineText}`;
    }
    setLineSpacingFromNode(spacingNode) {
        const lineAttr = Xml.getAttribute(spacingNode, "w:line");
        if (lineAttr !== undefined) {
            this._lineSpacing = parseInt(lineAttr, 10);
            this._lineRule = LineRule.exactly;
        }
        const ruleAttr = Xml.getAttribute(spacingNode, "w:lineRule");
        if (ruleAttr !== undefined) {
            this._lineRule = LineRule[ruleAttr];
        }
    }
    setParSpacingFromNode(spacingNode) {
        const beforeAttr = Xml.getAttribute(spacingNode, "w:before");
        if (beforeAttr !== undefined) {
            this._parSpacingBefore = Metrics.convertTwipsToPixels(parseInt(beforeAttr, 10));
        }
        const beforeLinesAttr = Xml.getAttribute(spacingNode, "w:beforeLines");
        if (beforeLinesAttr !== undefined) {
            this._parLinesBefore = parseInt(beforeLinesAttr, 10) / 100;
        }
        const beforeAutoAttr = Xml.getAttribute(spacingNode, "w:beforeAutospacing");
        if (beforeAutoAttr !== undefined) {
            this._parAutoSpacingBefore = Xml.attributeAsBoolean(beforeAutoAttr);
        }
        const afterAttr = Xml.getAttribute(spacingNode, "w:after");
        if (afterAttr !== undefined) {
            this._parSpacingAfter = Metrics.convertTwipsToPixels(parseInt(afterAttr, 10));
        }
        const afterLinesAttr = Xml.getAttribute(spacingNode, "w:afterLines");
        if (afterLinesAttr !== undefined) {
            this._parLinesAfter = parseInt(afterLinesAttr, 10) / 100;
        }
        const afterAutoAttr = Xml.getAttribute(spacingNode, "w:afterAutospacing");
        if (afterAutoAttr !== undefined) {
            this._parAutoSpacingAfter = Xml.attributeAsBoolean(afterAutoAttr);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyLXN0eWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhcmFncmFwaC9wYXItc3R5bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3RDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUU5QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRTNELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWhELE1BQU0sQ0FBTixJQUFZLGFBS1g7QUFMRCxXQUFZLGFBQWE7SUFDckIsa0NBQWlCLENBQUE7SUFDakIsOEJBQWEsQ0FBQTtJQUNiLDhCQUFhLENBQUE7SUFDYixnQ0FBZSxDQUFBO0FBQ25CLENBQUMsRUFMVyxhQUFhLEtBQWIsYUFBYSxRQUt4QjtBQUVELE1BQU0sQ0FBTixJQUFZLFFBSVg7QUFKRCxXQUFZLFFBQVE7SUFDaEIsK0JBQW1CLENBQUE7SUFDbkIsK0JBQW1CLENBQUE7SUFDbkIseUJBQWEsQ0FBQTtBQUNqQixDQUFDLEVBSlcsUUFBUSxLQUFSLFFBQVEsUUFJbkI7QUFFRCxNQUFNLE9BQU8sUUFBUTtJQUFyQjtRQUdXLGtCQUFhLEdBQThCLFNBQVMsQ0FBQztJQThNaEUsQ0FBQztJQTlMVSxNQUFNLENBQUMsdUJBQXVCLENBQUMsbUJBQThCO1FBQ2hFLE1BQU0sUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDaEMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMzQyxRQUFRLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ3BCLEtBQUssVUFBVTtvQkFD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