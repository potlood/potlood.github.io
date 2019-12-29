import { Xml } from "../utils/xml.js";
import { Fonts } from "../utils/fonts.js";
import { Metrics } from "../utils/metrics.js";
import { Style } from "./style.js";
export var UnderlineMode;
(function (UnderlineMode) {
    UnderlineMode["none"] = "none";
    UnderlineMode["dash"] = "dash";
    UnderlineMode["dashDotDotHeavy"] = "dashDotDotHeavy";
    UnderlineMode["dashDotHeavy"] = "dashDotHeavy";
    UnderlineMode["dashedHeavy"] = "dashedHeavy";
    UnderlineMode["dashLong"] = "dashLong";
    UnderlineMode["dashLongHeavy"] = "dashLongHeavy";
    UnderlineMode["dotDash"] = "dotDash";
    UnderlineMode["dotDotDash"] = "dotDotDash";
    UnderlineMode["dotted"] = "dotted";
    UnderlineMode["dottedHeavy"] = "dottedHeavy";
    UnderlineMode["double"] = "double";
    UnderlineMode["single"] = "single";
    UnderlineMode["thick"] = "thick";
    UnderlineMode["wave"] = "wave";
    UnderlineMode["wavyDouble"] = "wavyDouble";
    UnderlineMode["wavyHeavy"] = "wavyHeavy";
    UnderlineMode["words"] = "words";
})(UnderlineMode || (UnderlineMode = {}));
export class RunStyle {
    static fromPresentationNode(runPresentationNode) {
        // TODO: Handle themeShade, themeTint, em, emboss, fitText, imprint, outline, position, shadow, vanish, vertAlign
        const style = new RunStyle();
        runPresentationNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "w:rStyle":
                    style._basedOnId = Xml.getStringValue(child);
                    break;
                case "w:b":
                    style._bold = Xml.getBooleanValue(child);
                    break;
                case "w:i":
                    style._italic = Xml.getBooleanValue(child);
                    break;
                case "w:shd":
                    style._shadingColor = Style.readShading(child);
                    break;
                case "w:u":
                    const underlineMode = Xml.getStringValue(child);
                    if (underlineMode !== undefined) {
                        style._underlineMode = UnderlineMode[underlineMode];
                    }
                    break;
                case "w:strike":
                    style._strike = Xml.getBooleanValue(child);
                    break;
                case "w:dstrike":
                    style._dstrike = Xml.getBooleanValue(child);
                    break;
                case "w:rFonts":
                    const families = RunStyle.readFontFamily(child);
                    if (families !== undefined) {
                        style._fontFamily = families[Fonts.tryAddFonts(families)];
                    }
                    else {
                        style._fontFamily = undefined;
                    }
                    break;
                case "w:sz":
                    style._fontSize = RunStyle.readFontSize(child);
                    break;
                case "w:spacing":
                    const spacingTwips = Xml.getNumberValue(child);
                    if (spacingTwips !== undefined) {
                        style._charSpacing = Metrics.convertTwipsToPixels(spacingTwips);
                    }
                    break;
                case "w:w":
                    const stretchPercent = Xml.getNumberValue(child);
                    if (stretchPercent !== undefined) {
                        style._charStretch = stretchPercent / 100;
                    }
                    break;
                case "w:color":
                    style._color = Xml.getStringValue(child);
                    ;
                    break;
                case "w:caps":
                    style._caps = Xml.getBooleanValue(child);
                    break;
                case "w:smallCaps":
                    style._smallCaps = Xml.getBooleanValue(child);
                    break;
                case "w:vanish":
                    style._invisible = true;
                    break;
                case "w:szCs":
                case "w:iCs":
                case "w:bCs":
                case "w:lang":
                case "w:kern":
                    // Ignore
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during RunStyle reading.`);
                    break;
            }
        });
        return style;
    }
    applyNamedStyles(namedStyles) {
        if (this._basedOnId !== undefined && namedStyles !== undefined) {
            const baseStyle = namedStyles.getNamedStyle(this._basedOnId);
            if (baseStyle !== undefined) {
                this._basedOn = baseStyle;
            }
        }
    }
    updateFont(fontFamily, bold, fontSize) {
        this._fontFamily = fontFamily;
        this._bold = bold;
        this._fontSize = fontSize;
    }
    toString() {
        const i = (this._italic !== undefined) ? `i=${this._italic}` : "";
        const b = (this._bold !== undefined) ? `b=${this._bold.toString()}` : "";
        const u = (this._underlineMode !== undefined) ? `u=${this._underlineMode.toString()}` : "";
        const strike = (this._strike !== undefined) ? `strike=${this._strike.toString()}` : "";
        const font = (this._fontFamily !== undefined) ? `font=${this._fontFamily.toString()}` : "";
        const size = (this._fontSize !== undefined) ? `size=${this._fontSize.toString()}` : "";
        const dstrike = (this._dstrike !== undefined) ? `dstrike=${this._dstrike.toString()}` : "";
        const charSpacing = (this._charSpacing !== undefined) ? `char_spacing=${this._charSpacing.toString()}` : "";
        const charStretch = (this._charStretch !== undefined) ? `char_stretch=${this._charStretch.toString()}` : "";
        const color = (this._color !== undefined) ? `color=${this._color.toString()}` : "";
        const caps = (this._caps !== undefined) ? `caps=${this._caps.toString()}` : "";
        const smallcaps = (this._smallCaps !== undefined) ? `smallcaps=${this._smallCaps.toString()}` : "";
        return `RunStyle: ${i} ${b} ${u} ${strike} ${font} ${size} ${dstrike} ${charSpacing} ${charStretch} ${color} ${caps} ${smallcaps}`;
    }
    /**
     * Return fonts from specified node in reverse order.
     */
    static readFontFamily(fontNode) {
        let fonts = undefined;
        const asciiFont = Xml.getAttribute(fontNode, "w:ascii");
        if (asciiFont !== undefined) {
            fonts = asciiFont.split(';');
        }
        return fonts;
    }
    static readFontSize(sizeNode) {
        const sizeInPoints = Xml.getNumberValue(sizeNode);
        return (sizeInPoints !== undefined) ? Metrics.convertPointToFontSize(sizeInPoints) : undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLXN0eWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3RleHQvcnVuLXN0eWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDMUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFHbkMsTUFBTSxDQUFOLElBQVksYUFtQlg7QUFuQkQsV0FBWSxhQUFhO0lBQ3JCLDhCQUFhLENBQUE7SUFDYiw4QkFBYSxDQUFBO0lBQ2Isb0RBQW1DLENBQUE7SUFDbkMsOENBQTZCLENBQUE7SUFDN0IsNENBQTJCLENBQUE7SUFDM0Isc0NBQXFCLENBQUE7SUFDckIsZ0RBQStCLENBQUE7SUFDL0Isb0NBQW1CLENBQUE7SUFDbkIsMENBQXlCLENBQUE7SUFDekIsa0NBQWlCLENBQUE7SUFDakIsNENBQTJCLENBQUE7SUFDM0Isa0NBQWlCLENBQUE7SUFDakIsa0NBQWlCLENBQUE7SUFDakIsZ0NBQWUsQ0FBQTtJQUNmLDhCQUFhLENBQUE7SUFDYiwwQ0FBeUIsQ0FBQTtJQUN6Qix3Q0FBdUIsQ0FBQTtJQUN2QixnQ0FBZSxDQUFBO0FBQ25CLENBQUMsRUFuQlcsYUFBYSxLQUFiLGFBQWEsUUFtQnhCO0FBRUQsTUFBTSxPQUFPLFFBQVE7SUFrQlYsTUFBTSxDQUFDLG9CQUFvQixDQUFDLG1CQUE4QjtRQUM3RCxpSEFBaUg7UUFDakgsTUFBTSxLQUFLLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUM3QixtQkFBbUIsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzNDLFFBQU8sS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDbkIsS0FBSyxVQUFVO29CQUNY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