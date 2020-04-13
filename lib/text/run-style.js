import { Xml } from "../utils/xml.js";
import { Fonts } from "../utils/fonts.js";
import { Metrics } from "../utils/metrics.js";
import { Style } from "./style.js";
export var UnderlineMode;
(function (UnderlineMode) {
    UnderlineMode[UnderlineMode["None"] = 0] = "None";
    UnderlineMode[UnderlineMode["Dash"] = 1] = "Dash";
    UnderlineMode[UnderlineMode["DashDotDotHeavy"] = 2] = "DashDotDotHeavy";
    UnderlineMode[UnderlineMode["DashDotHeavy"] = 3] = "DashDotHeavy";
    UnderlineMode[UnderlineMode["DashedHeavy"] = 4] = "DashedHeavy";
    UnderlineMode[UnderlineMode["DashLong"] = 5] = "DashLong";
    UnderlineMode[UnderlineMode["DashLongHeavy"] = 6] = "DashLongHeavy";
    UnderlineMode[UnderlineMode["DotDash"] = 7] = "DotDash";
    UnderlineMode[UnderlineMode["DotDotDash"] = 8] = "DotDotDash";
    UnderlineMode[UnderlineMode["Dotted"] = 9] = "Dotted";
    UnderlineMode[UnderlineMode["DottedHeavy"] = 10] = "DottedHeavy";
    UnderlineMode[UnderlineMode["Double"] = 11] = "Double";
    UnderlineMode[UnderlineMode["Single"] = 12] = "Single";
    UnderlineMode[UnderlineMode["Thick"] = 13] = "Thick";
    UnderlineMode[UnderlineMode["Wave"] = 14] = "Wave";
    UnderlineMode[UnderlineMode["WavyDouble"] = 15] = "WavyDouble";
    UnderlineMode[UnderlineMode["WavyHeavy"] = 16] = "WavyHeavy";
    UnderlineMode[UnderlineMode["Words"] = 17] = "Words";
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
                        style._underlineMode = RunStyle.readUnderlineMode(underlineMode);
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
    static readUnderlineMode(underlineStr) {
        let underlineMode;
        switch (underlineStr) {
            case "dash":
                underlineMode = UnderlineMode.Dash;
                break;
            case "dashDotDotHeavy":
                underlineMode = UnderlineMode.DashDotDotHeavy;
                break;
            case "dashDotHeavy":
                underlineMode = UnderlineMode.DashDotHeavy;
                break;
            case "dashedHeavy":
                underlineMode = UnderlineMode.DashedHeavy;
                break;
            case "dashLong":
                underlineMode = UnderlineMode.DashLong;
                break;
            case "dashLongHeavy":
                underlineMode = UnderlineMode.DashLongHeavy;
                break;
            case "dotDash":
                underlineMode = UnderlineMode.DotDash;
                break;
            case "dotDotDash":
                underlineMode = UnderlineMode.DotDotDash;
                break;
            case "dotted":
                underlineMode = UnderlineMode.Dotted;
                break;
            case "dottedHeavy":
                underlineMode = UnderlineMode.DottedHeavy;
                break;
            case "double":
                underlineMode = UnderlineMode.Double;
                break;
            case "single":
                underlineMode = UnderlineMode.Single;
                break;
            case "thick":
                underlineMode = UnderlineMode.Thick;
                break;
            case "wave":
                underlineMode = UnderlineMode.Wave;
                break;
            case "wavyDouble":
                underlineMode = UnderlineMode.WavyDouble;
                break;
            case "wavyHeavy":
                underlineMode = UnderlineMode.WavyHeavy;
                break;
            case "words":
                underlineMode = UnderlineMode.Words;
                break;
            case "none":
            default:
                underlineMode = UnderlineMode.None;
                break;
        }
        return underlineMode;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLXN0eWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3RleHQvcnVuLXN0eWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDMUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFHbkMsTUFBTSxDQUFOLElBQVksYUFtQlg7QUFuQkQsV0FBWSxhQUFhO0lBQ3JCLGlEQUFJLENBQUE7SUFDSixpREFBSSxDQUFBO0lBQ0osdUVBQWUsQ0FBQTtJQUNmLGlFQUFZLENBQUE7SUFDWiwrREFBVyxDQUFBO0lBQ1gseURBQVEsQ0FBQTtJQUNSLG1FQUFhLENBQUE7SUFDYix1REFBTyxDQUFBO0lBQ1AsNkRBQVUsQ0FBQTtJQUNWLHFEQUFNLENBQUE7SUFDTixnRUFBVyxDQUFBO0lBQ1gsc0RBQU0sQ0FBQTtJQUNOLHNEQUFNLENBQUE7SUFDTixvREFBSyxDQUFBO0lBQ0wsa0RBQUksQ0FBQTtJQUNKLDhEQUFVLENBQUE7SUFDViw0REFBUyxDQUFBO0lBQ1Qsb0RBQUssQ0FBQTtBQUNULENBQUMsRUFuQlcsYUFBYSxLQUFiLGFBQWEsUUFtQnhCO0FBRUQsTUFBTSxPQUFPLFFBQVE7SUFrQlYsTUFBTSxDQUFDLG9CQUFvQixDQUFDLG1CQUE4QjtRQUM3RCxpSEFBaUg7UUFDakgsTUFBTSxLQUFLLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUM3QixtQkFBbUIsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzNDLFFBQU8sS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDbkIsS0FBSyxVQUFVO29CQUNYLEtBQUssQ0FBQyxVQUFVLEdBQUcsR0FBRyxD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LENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNsRSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDekUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNGLE1BQU0sTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN2RixNQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDM0YsTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3ZGLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMzRixNQUFNLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEtBQUssU0FBUyxDQUFDLENB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