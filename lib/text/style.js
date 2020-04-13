import { ParStyle, Justification } from "../paragraph/par-style.js";
import { RunStyle, UnderlineMode } from "./run-style.js";
import { Xml } from "../utils/xml.js";
import { InSequence } from "../utils/in-sequence.js";
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
        return this.getValue(UnderlineMode.None, undefined, (runStyle) => runStyle._underlineMode);
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
            return parStyle.getLineSpacing(style);
        }, undefined);
        if (complexSpacing === undefined) {
            complexSpacing = this.fontSize * 1.08;
        }
        return complexSpacing;
    }
    get shadingColor() {
        return this.getValue("000000", (parStyle) => parStyle.shadingColor, (runStyle) => runStyle._shadingColor);
    }
    getIndentation(inRun, inParagaph) {
        let identation = this.getValue(0, (parStyle) => parStyle.indentation, undefined);
        if ((inParagaph === InSequence.First || inParagaph === InSequence.Only) &&
            (inRun === InSequence.First || inRun === InSequence.Only)) {
            const hanging = this.getValue(undefined, (parStyle) => parStyle.hanging, undefined);
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
        return this.getValue(Justification.left, (parStyle) => parStyle.justification, undefined);
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
                const parRunStyle = this.parStyle.runStyle;
                if (val === undefined && runCb !== undefined && parRunStyle !== undefined) {
                    val = runCb(parRunStyle);
                }
                if (val === undefined && this.parStyle.numStyle !== undefined) {
                    // Fourthly look at the numbering style.
                    const numStyle = this.parStyle.numStyle.style;
                    if (numStyle !== undefined) {
                        val = numStyle.getRecursive(parCb, runCb);
                    }
                }
                if (val === undefined && this.parStyle.basedOn !== undefined) {
                    // Fifthly look at the base styles of the PARAGRAPH style.
                    val = this.parStyle.basedOn.getRecursive(parCb, runCb);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGV4dC9zdHlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3RDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUVyRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFckQsTUFBTSxPQUFPLEtBQUs7SUEwRWQsWUFBWSxRQUFtQixFQUFFLFFBQW1CO1FBQ2hELElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUNyRSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxFQUFFLENBQUM7SUFDekUsQ0FBQztJQXJFTSxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQW9CO1FBQzVDLElBQUksUUFBUSxHQUF5QixTQUFTLENBQUM7UUFDL0MsSUFBSSxRQUFRLEdBQXlCLFNBQVMsQ0FBQztRQUMvQyxJQUFJLFNBQVMsR0FBdUIsU0FBUyxDQUFDO1FBQzlDLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pDLHVDQUF1QztZQUN2QyxRQUFRLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ3BCLEtBQUssT0FBTztvQkFDUixRQUFRLEdBQUcsUUFBUSxDQUFDLHVCQUF1QixDQUFDLEtBQUss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