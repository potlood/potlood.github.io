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
                case "w:highlight":
                    // Highlight equals yellow shading
                    style._shadingColor = "ffff00";
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
                case "w:webHidden":
                case "w:vanish":
                    style._invisible = true;
                    break;
                case "w:shadow":
                case "w:outline":
                case "w:position":
                case "w:vertAlign":
                case "w:em":
                    // TODO: Implement.
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