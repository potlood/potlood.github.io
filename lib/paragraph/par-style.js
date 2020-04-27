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
    get parent() {
        return this._basedOn || this._docDefaults;
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
        if (namedStyles !== undefined) {
            this._docDefaults = namedStyles.docDefaults;
            if (this._basedOnId !== undefined) {
                const baseStyle = namedStyles.getNamedStyle(this._basedOnId);
                if (baseStyle !== undefined) {
                    this._basedOn = baseStyle;
                }
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
        cloned._docDefaults = this._docDefaults;
        cloned._basedOn = this._basedOn;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyLXN0eWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhcmFncmFwaC9wYXItc3R5bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3RDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUU5QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRTNELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWhELE1BQU0sQ0FBTixJQUFZLGFBS1g7QUFMRCxXQUFZLGFBQWE7SUFDckIsa0NBQWlCLENBQUE7SUFDakIsOEJBQWEsQ0FBQTtJQUNiLDhCQUFhLENBQUE7SUFDYixnQ0FBZSxDQUFBO0FBQ25CLENBQUMsRUFMVyxhQUFhLEtBQWIsYUFBYSxRQUt4QjtBQUVELE1BQU0sQ0FBTixJQUFZLFFBSVg7QUFKRCxXQUFZLFFBQVE7SUFDaEIsK0JBQW1CLENBQUE7SUFDbkIsK0JBQW1CLENBQUE7SUFDbkIseUJBQWEsQ0FBQTtBQUNqQixDQUFDLEVBSlcsUUFBUSxLQUFSLFFBQVEsUUFJbkI7QUFFRCxNQUFNLE9BQU8sUUFBUTtJQUFyQjtRQUNXLGtCQUFhLEdBQThCLFNBQVMsQ0FBQztJQXlOaEUsQ0FBQztJQXRNVSxNQUFNLENBQUMsdUJBQXVCLENBQUMsbUJBQThCO1FBQ2hFLE1BQU0sUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDaEMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMzQyxRQUFRLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ3BCLEtBQUssVUFBVTtvQkFD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