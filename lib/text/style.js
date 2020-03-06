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
            // ISO/IEC 29500-1:2016 section: 17.7.4
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
                case "w:aliases":
                case "w:autoRedefine":
                case "w:qFormat":
                case "w:semiHidden":
                case "w:uiPriority":
                case "w:unhideWhenUsed":
                case "w:rsid":
                case "w:locked":
                case "w:lsdException":
                case "w:personal":
                case "w:personalCompose":
                case "w:personalReply":
                    // Ignore
                    break;
                case "w:start":
                case "w:lvlText":
                case "w:lvlJc":
                case "w:numFmt":
                case "w:suff":
                    // Ignore, Numbering style related.
                    break;
                case "w:next":
                case "w:link":
                case "w:tblPr":
                case "w:hidden":
                case "w:latentStyles":
                case "w:pStyle":
                    // TODO: Read these attributes
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
                        val = numStyle.getRecursive(parCb, runCb);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGV4dC9zdHlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUM5RSxPQUFPLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDckQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTlDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUVyRCxNQUFNLE9BQU8sS0FBSztJQTBFZCxZQUFZLFFBQW1CLEVBQUUsUUFBbUI7UUFDaEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQ3JFLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsQ0FBQztJQUN6RSxDQUFDO0lBckVNLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBb0I7UUFDNUMsSUFBSSxRQUFRLEdBQXlCLFNBQVMsQ0FBQztRQUMvQyxJQUFJLFFBQVEsR0FBeUIsU0FBUyxDQUFDO1FBQy9DLElBQUksU0FBUyxHQUF1QixTQUFTLENBQUM7UUFDOUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDakMsdUNBQXVDO1lBQ3ZDLFFBQVEsS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDcEIs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