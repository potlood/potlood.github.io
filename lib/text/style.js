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
    static fromDocDefaultsNode(docDefaultsNode) {
        let parStyle = undefined;
        let runStyle = undefined;
        const runDefaults = Xml.getFirstChildOfName(docDefaultsNode, "w:rPrDefault");
        if (runDefaults !== undefined) {
            const runStyleNode = Xml.getFirstChildOfName(runDefaults, "w:rPr");
            if (runStyleNode !== undefined) {
                runStyle = RunStyle.fromPresentationNode(runStyleNode);
            }
        }
        const parDefaults = Xml.getFirstChildOfName(docDefaultsNode, "w:pPrDefault");
        if (parDefaults !== undefined) {
            const parStyleNode = Xml.getFirstChildOfName(parDefaults, "w:pPr");
            if (parStyleNode !== undefined) {
                parStyle = ParStyle.fromParPresentationNode(parStyleNode);
            }
        }
        return new Style(parStyle, runStyle);
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
            const runParent = this.runStyle.parent;
            if (val === undefined && runParent !== undefined) {
                // Secondly look at the base styles of the RUN style.
                val = runParent.getRecursive(parCb, runCb);
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
                const parParent = this.parStyle.parent;
                if (val === undefined && parParent !== undefined) {
                    // Fifthly look at the base styles of the PARAGRAPH style.
                    val = parParent.getRecursive(parCb, runCb);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGV4dC9zdHlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3RDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUVyRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFckQsTUFBTSxPQUFPLEtBQUs7SUE4RmQsWUFBWSxRQUFtQixFQUFFLFFBQW1CO1FBQ2hELElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUNyRSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxFQUFFLENBQUM7SUFDekUsQ0FBQztJQXpGTSxNQUFNLENBQUMsbUJBQW1CLENBQUMsZUFBMEI7UUFDeEQsSUFBSSxRQUFRLEdBQXlCLFNBQVMsQ0FBQztRQUMvQyxJQUFJLFFBQVEsR0FBeUIsU0FBUyxDQUFDO1FBQy9DLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDN0UsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQzNCLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDbkUsSUFBSSxZQUFZLEtB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QUNELE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxJQUFXLElBQUk7UUFDWCxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFBLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDakQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNDLE1BQU0sSUFBSSxHQUFHLFVBQVUsR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDekYsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLFFBQVE7UUFDWCxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDOUUsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDbkQsTUFBTSxHQUFHLEdBQUcsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDeEYsTUFBTSxJQUFJLEdBQUcsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDM0YsTUFBTSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDN0IsTUFBTSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDdEMsTUFBTSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDL0MsTUFBTSxNQUFNLEdBQUcsVUFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDbEQsTUFBTSxJQUFJLEdBQUcsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDbEQsTUFBTSxJQUFJLEdBQUcsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDaEQsTUFBTSxPQUFPLEdBQUcsV0FBVyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDMUQsTUFBTSxXQUFXLEdBQUcsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztRQUNsRSxNQUFNLFdBQVcsR0FBRyxnQkFBZ0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO1FBQ2xFLE1BQU0sS0FBSyxHQUFHLFNBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO1FBQy9DLE1BQU0sSUFBSSxHQUFHLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO1FBQzVDLE1BQU0sU0FBUyxHQUFHLGFBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO1FBQzNELE9BQU8sVUFBVSxJQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksT0FBTyxJQUFJLFdBQVcsSUFBSSxXQUFXLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxTQUFTLEVBQUUsQ0FBQztJQUNuSyxDQUFDO0lBRU8sUUFBUSxDQUFJLE9BQVUsRUFBRSxLQUE2QyxFQUFFLEtBQTZDO1FBQ3hILElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzFDLGtEQUFrRDtRQUNsRCxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFDbkIsR0FBRyxHQUFHLE9BQU8sQ0FBQztTQUNqQjtRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVPLFlBQVksQ0FDaEIsS0FBNkMsRUFDN0MsS0FBNkMsRUFDN0MsT0FBaUQ7UUFFakQsbUJBQW1CO1FBQ25CLHNCQUFzQjtRQUN0QixpQkFBaUI7UUFDakIscUJBQXFCO1FBQ3JCLHFCQUFxQjtRQUNyQixlQUFlO1FBQ2YsaUJBQWlCO1FBQ2pCLDZEQUE2RDtRQUM3RCxJQUFJLEdBQUcsR0FBa0IsU0FBUyxDQUFDO1FBQ25DLHdDQUF3QztRQUN4QyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQzdCLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtnQkFDckIsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdEMsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO29CQUN4QixHQUFHLEdBQUcsUUFBUSxDQUFDO2lCQUNsQjthQUNKO1lBQ0QsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDdkMsSUFBSSxHQUFHLEtBQUssU0FBUyxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7Z0JBQzlDLHFEQUFxRDtnQkFDckQsR0FBRyxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUksS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ2pEO1NBQ0o7UUFDRCxnREFBZ0Q7UUFDaEQsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1lBQ25CLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7Z0JBQzdCLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtvQkFDckIsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO3dCQUN4QixHQUFHLEdBQUcsUUFBUSxDQUFDO3FCQUNsQjtpQkFDSjtnQkFDRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztnQkFDM0MsSUFBSSxHQUFHLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtvQkFDdkUsR0FBRyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDNUI7Z0JBQ0QsSUFBSSxHQUFHLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtvQkFDM0Qsd0NBQXdDO29CQUN4QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7b0JBQzlDLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTt3QkFDeEIsR0FBRyxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUksS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO3FCQUNoRDtpQkFDSjtnQkFDRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDdkMsSUFBSSxHQUFHLEtBQUssU0FBUyxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7b0JBQzlDLDBEQUEwRDtvQkFDMUQsR0FBRyxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUksS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUNqRDthQUNKO1NBQ0o7UUFDRCxtQ0FBbUM7UUFDbkMsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1lBQ25CLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7Z0JBQy9CLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtvQkFDdkIsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDdkMsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO3dCQUNyQixHQUFHLEdBQUcsS0FBSyxDQUFDO3FCQUNmO2lCQUNKO2FBQ0o7U0FDSjtRQUNELDZEQUE2RDtRQUM3RCxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFDbkIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM5QixJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7Z0JBQ3ZCLEdBQUcsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFJLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzthQUMvQztTQUNKO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0NBQ0oifQ==