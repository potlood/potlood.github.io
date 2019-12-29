import { ParStyle, Justification, LineRule } from "../paragraph/par-style.js";
import { RunStyle, UnderlineMode } from "./run-style.js";
import { Xml } from "../utils/xml.js";
import { InSequence } from "../utils/in-sequence.js";
import { Metrics } from "../utils/metrics.js";
import { Emphasis } from "./positioned-text-line.js";
export class Style {
    constructor(parStyle, runStyle) {
        this.parStyle = (parStyle !== undefined) ? parStyle : new ParStyle();
        this.runStyle = (runStyle !== undefined) ? runStyle : new RunStyle();
    }
    static fromStyleNode(styleNode) {
        let parStyle = undefined;
        let runStyle = undefined;
        let basedOnId = undefined;
        styleNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "w:pPr":
                    parStyle = ParStyle.fromParPresentationNode(child);
                    break;
                case "w:rPr":
                    runStyle = RunStyle.fromPresentationNode(child);
                    break;
                case "w:basedOn":
                    basedOnId = Xml.getStringValue(child);
                    break;
                case "w:name":
                case "w:qFormat":
                    // Ignore
                    break;
                case "w:start":
                case "w:next":
                case "w:lvlText":
                case "w:lvlJc":
                case "w:numFmt":
                case "w:suff":
                    // TODO: Read these Numbering style attributes
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Style reading.`);
                    break;
            }
        });
        const style = new Style(parStyle, runStyle);
        style._basedOnId = basedOnId;
        return style;
    }
    static readShading(shadingNode) {
        let shadingColor = undefined;
        // TODO: Parse patterns also.
        const fillAttr = Xml.getAttribute(shadingNode, "w:fill");
        if (fillAttr !== undefined) {
            shadingColor = fillAttr;
        }
        return shadingColor;
    }
    applyNamedStyles(namedStyles) {
        if (this._basedOnId !== undefined && namedStyles !== undefined) {
            const baseStyle = namedStyles.getNamedStyle(this._basedOnId);
            if (baseStyle !== undefined) {
                this._basedOn = baseStyle;
            }
        }
        if (this.runStyle !== undefined) {
            this.runStyle.applyNamedStyles(namedStyles);
        }
        if (this.parStyle !== undefined) {
            this.parStyle.applyNamedStyles(namedStyles);
        }
    }
    get italic() {
        return this.getValue(false, undefined, (runStyle) => runStyle._italic);
    }
    get bold() {
        return this.getValue(false, undefined, (runStyle) => runStyle._bold);
    }
    get underlineMode() {
        return this.getValue(UnderlineMode.none, undefined, (runStyle) => runStyle._underlineMode);
    }
    get strike() {
        return this.getValue(false, undefined, (runStyle) => runStyle._strike);
    }
    get doubleStrike() {
        return this.getValue(false, undefined, (runStyle) => runStyle._dstrike);
    }
    get fontFamily() {
        return this.getValue("Arial", undefined, (runStyle) => runStyle._fontFamily);
    }
    get fontSize() {
        return this.getValue(12, undefined, (runStyle) => runStyle._fontSize);
    }
    get charSpacing() {
        return this.getValue(0, undefined, (runStyle) => runStyle._charSpacing);
    }
    get charStretch() {
        return this.getValue(1, undefined, (runStyle) => runStyle._charStretch);
    }
    get lineSpacing() {
        const style = this;
        let complexSpacing = this.getValue(undefined, (parStyle) => {
            let spacing = parStyle._lineSpacing;
            if (spacing !== undefined) {
                const lineRule = parStyle._lineRule;
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
        }, undefined);
        if (complexSpacing === undefined) {
            complexSpacing = this.fontSize * 1.08;
        }
        return complexSpacing;
    }
    get shadingColor() {
        return this.getValue("000000", (parStyle) => parStyle._shadingColor, (runStyle) => runStyle._shadingColor);
    }
    getIndentation(inRun, inParagaph) {
        let identation = this.getValue(0, (parStyle) => parStyle._indentation, undefined);
        if ((inParagaph === InSequence.First || inParagaph === InSequence.Only) &&
            (inRun === InSequence.First || inRun === InSequence.Only)) {
            const hanging = this.getValue(undefined, (parStyle) => parStyle._hanging, undefined);
            if (hanging !== undefined) {
                identation -= hanging;
            }
        }
        return identation;
    }
    get caps() {
        return this.getValue(false, undefined, (runStyle) => runStyle._caps);
    }
    get smallCaps() {
        return this.getValue(false, undefined, (runStyle) => runStyle._smallCaps);
    }
    get color() {
        return this.getValue("000000", undefined, (runStyle) => runStyle._color);
    }
    get justification() {
        return this.getValue(Justification.left, (parStyle) => parStyle._justification, undefined);
    }
    get invisible() {
        return this.getValue(false, undefined, (runStyle) => runStyle._invisible);
    }
    get emphasis() {
        let emphasis = Emphasis.Normal;
        if (this.bold) {
            emphasis |= Emphasis.Bold;
        }
        if (this.italic) {
            emphasis |= Emphasis.Italic;
        }
        if (this.smallCaps) {
            emphasis |= Emphasis.SmallCaps;
        }
        return emphasis;
    }
    get font() {
        const italicText = (this.italic) ? "italic " : "";
        const boldText = (this.bold) ? "bold " : "";
        const font = italicText + boldText + Math.round(this.fontSize) + 'px ' + this.fontFamily;
        return font;
    }
    toString() {
        const base = (this._basedOnId !== undefined) ? `base=${this._basedOnId}` : "";
        const just = `jc=${this.justification.toString()}`;
        const ind = `ind=${this.getIndentation(InSequence.First, InSequence.First).toString()}`;
        const hang = `ind=${this.getIndentation(InSequence.Middle, InSequence.Middle).toString()}`;
        const i = `i=${this.italic}`;
        const b = `b=${this.bold.toString()}`;
        const u = `u=${this.underlineMode.toString()}`;
        const strike = `strike=${this.strike.toString()}`;
        const font = `font=${this.fontFamily.toString()}`;
        const size = `size=${this.fontSize.toString()}`;
        const dstrike = `dstrike=${this.doubleStrike.toString()}`;
        const charSpacing = `char_spacing=${this.charSpacing.toString()}`;
        const lineSpacing = `line_spacing=${this.lineSpacing.toString()}`;
        const color = `color=${this.color.toString()}`;
        const caps = `caps=${this.caps.toString()}`;
        const smallcaps = `smallcaps=${this.smallCaps.toString()}`;
        return `Style: ${base} ${just} ${ind} ${hang} ${i} ${b} ${u} ${strike} ${font} ${size} ${dstrike} ${charSpacing} ${lineSpacing} ${color} ${caps} ${smallcaps}`;
    }
    getValue(initial, parCb, runCb) {
        let val = this.getRecursive(parCb, runCb);
        // If still not defined, assign the initial value.
        if (val === undefined) {
            val = initial;
        }
        return val;
    }
    getRecursive(parCb, runCb, tableCb) {
        // Style hierarchy:
        // 1 Document defaults
        // 2 Table styles
        // 3 Numbering styles
        // 4 Paragraph styles
        // 5 Run styles
        // 6 Local Styles
        // We inspect the hierarchy backward, for performance reasons
        let val = undefined;
        // First look at local RUN presentation.
        if (this.runStyle !== undefined) {
            if (runCb !== undefined) {
                const localRun = runCb(this.runStyle);
                if (localRun !== undefined) {
                    val = localRun;
                }
            }
            if (val === undefined && this.runStyle._basedOn !== undefined) {
                // Secondly look at the base styles of the RUN style.
                val = this.runStyle._basedOn.getRecursive(parCb, runCb);
            }
        }
        // Thirdly look at local PARAGRAPH presentation.
        if (val === undefined) {
            if (this.parStyle !== undefined) {
                if (parCb !== undefined) {
                    const localPar = parCb(this.parStyle);
                    if (localPar !== undefined) {
                        val = localPar;
                    }
                }
                if (val === undefined && this.parStyle._numStyle !== undefined) {
                    // Fourthly look at the numbering style.
                    const numStyle = this.parStyle._numStyle.style;
                    if (numStyle !== undefined) {
                        val = this.parStyle._numStyle.style.getRecursive(parCb, runCb);
                    }
                }
                if (val === undefined && this.parStyle._basedOn !== undefined) {
                    // Fifthly look at the base styles of the PARAGRAPH style.
                    val = this.parStyle._basedOn.getRecursive(parCb, runCb);
                }
            }
        }
        // Sixthly look at the Table Style.
        if (val === undefined) {
            if (this.tableStyle !== undefined) {
                if (tableCb !== undefined) {
                    const table = tableCb(this.tableStyle);
                    if (table !== undefined) {
                        val = table;
                    }
                }
            }
        }
        // Sevently look at the Style where this style is based upon.
        if (val === undefined) {
            const basedOn = this._basedOn;
            if (basedOn !== undefined) {
                val = basedOn.getRecursive(parCb, runCb);
            }
        }
        return val;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGV4dC9zdHlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUM5RSxPQUFPLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDckQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTlDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUVyRCxNQUFNLE9BQU8sS0FBSztJQXVEZCxZQUFZLFFBQW1CLEVBQUUsUUFBbUI7UUFDaEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQ3JFLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsQ0FBQztJQUN6RSxDQUFDO0lBbERNLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBb0I7UUFDNUMsSUFBSSxRQUFRLEdBQXlCLFNBQVMsQ0FBQztRQUMvQyxJQUFJLFFBQVEsR0FBeUIsU0FBUyxDQUFDO1FBQy9DLElBQUksU0FBUyxHQUF1QixTQUFTLENBQUM7UUFDOUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDakMsUUFBUSxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNwQixLQUFLLE9BQU87b0JB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