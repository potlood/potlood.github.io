import { Style } from "../text/style.js";
import { Xml } from "../utils/xml.js";
export var NumberingFormat;
(function (NumberingFormat) {
    NumberingFormat["none"] = "none";
    NumberingFormat["bullet"] = "bullet";
    NumberingFormat["cardinalText"] = "cardinalText";
    NumberingFormat["chicago"] = "chicago";
    NumberingFormat["decimal"] = "decimal";
    NumberingFormat["decimalEnclosedCircle"] = "decimalEnclosedCircle";
    NumberingFormat["decimalEnclodedFullStop"] = "decimalEnclosedFullstop";
    NumberingFormat["decimalEnclosedParentheses"] = "decimalEnclosedParen";
    NumberingFormat["decimalZero"] = "decimalZero";
    NumberingFormat["lowerLetter"] = "lowerLetter";
    NumberingFormat["lowerRoman"] = "lowerRoman";
    NumberingFormat["ordinalText"] = "ordinalText";
    NumberingFormat["upperLetter"] = "upperLetter";
    NumberingFormat["upperRoman"] = "upperRoman";
})(NumberingFormat || (NumberingFormat = {}));
export var NumberingSuffix;
(function (NumberingSuffix) {
    NumberingSuffix["nothing"] = "nothing";
    NumberingSuffix["space"] = "space";
    NumberingSuffix["tab"] = "tab";
})(NumberingSuffix || (NumberingSuffix = {}));
export class NumberingLevel {
    constructor(index) {
        this.style = new Style();
        this.format = NumberingFormat.none;
        this.start = undefined;
        this.suffix = NumberingSuffix.tab;
        this.text = undefined;
        this._romanCodes = [
            ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
            ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"],
            ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"]
        ]; // Hundreds
        this.index = index;
    }
    static fromLevelNode(namedStyles, levelNode) {
        const indexAttr = Xml.getAttribute(levelNode, "w:ilvl");
        if (indexAttr === undefined) {
            return undefined;
        }
        const index = parseInt(indexAttr, 10);
        const level = new NumberingLevel(index);
        level.style = Style.fromStyleNode(levelNode);
        level.style.applyNamedStyles(namedStyles);
        levelNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "w:start":
                    level.start = Xml.getNumberValue(child);
                    break;
                case "w:suff":
                    const suffix = Xml.getStringValue(child);
                    if (suffix !== undefined) {
                        level.suffix = NumberingSuffix[suffix];
                    }
                    break;
                case "w:numFmt":
                    const format = Xml.getStringValue(child);
                    if (format !== undefined) {
                        level.format = NumberingFormat[format];
                    }
                    break;
                case "w:lvlText":
                    level.text = Xml.getStringValue(child);
                    break;
                case "w:lvlJc":
                case "w:pPr":
                case "w:rPr":
                case "w:pStyle":
                    // Ignore, part of Style.
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Numbering Level reading.`);
                    break;
            }
        });
        return level;
    }
    getText(indices) {
        //if (this.text !== undefined) {
        //    // Work around for FireFox 71+, crashing on non ASCII characters.
        //   return (this.text === "") ? "" : "-";
        //}
        return this.getFormatted(indices);
    }
    getFormatted(indices) {
        let text;
        switch (this.format) {
            case NumberingFormat.bullet:
                text = "&#x2002;";
                // Work around for FireFox 71+, crashing on non ASCII characters.
                text = "-";
                break;
            case NumberingFormat.none:
                text = "";
                break;
            case NumberingFormat.decimal:
                text = indices.map(idx => idx.toString()).join(".");
                break;
            case NumberingFormat.lowerLetter:
                text = indices.map(this._toDecimal).join(".");
                break;
            case NumberingFormat.upperLetter:
                text = indices.map(this._toDecimal).join(".").toLocaleUpperCase();
                break;
            case NumberingFormat.lowerRoman:
                text = indices.map(this._toRoman).join(".");
                break;
            case NumberingFormat.upperRoman:
                text = indices.map(this._toRoman).join(".").toLocaleUpperCase();
                break;
            default:
                console.log(`Don't know how to render numbering format ${this.format}`);
                text = "-";
                break;
        }
        return text;
    }
    _toDecimal(num) {
        if (num > 26) {
            return this._toDecimal(num / 26) + this._toDecimal(num % 26);
        }
        // 1 maps to a, which is charcode 97.
        return String.fromCharCode(96 + Math.floor(num));
    }
    _toRoman(num) {
        var numeral = "";
        var digits = num.toString().split('').reverse();
        for (let i = 0; i < digits.length; i++) {
            numeral = this._romanCodes[i][parseInt(digits[i])] + numeral;
        }
        return numeral;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyaW5nLWxldmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL251bWJlcmluZy9udW1iZXJpbmctbGV2ZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRXpDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV0QyxNQUFNLENBQU4sSUFBWSxlQWVYO0FBZkQsV0FBWSxlQUFlO0lBQ3ZCLGdDQUFhLENBQUE7SUFDYixvQ0FBaUIsQ0FBQTtJQUNqQixnREFBNkIsQ0FBQTtJQUM3QixzQ0FBbUIsQ0FBQTtJQUNuQixzQ0FBbUIsQ0FBQTtJQUNuQixrRUFBK0MsQ0FBQTtJQUMvQyxzRUFBbUQsQ0FBQTtJQUNuRCxzRUFBbUQsQ0FBQTtJQUNuRCw4Q0FBMkIsQ0FBQTtJQUMzQiw4Q0FBMkIsQ0FBQTtJQUMzQiw0Q0FBeUIsQ0FBQTtJQUN6Qiw4Q0FBMkIsQ0FBQTtJQUMzQiw4Q0FBMkIsQ0FBQTtJQUMzQiw0Q0FBeUIsQ0FBQTtBQUM3QixDQUFDLEVBZlcsZUFBZSxLQUFmLGVBQWUsUUFlMUI7QUFFRCxNQUFNLENBQU4sSUFBWSxlQUlYO0FBSkQsV0FBWSxlQUFlO0lBQ3ZCLHNDQUFtQixDQUFBO0lBQ25CLGtDQUFlLENBQUE7SUFDZiw4QkFBVyxDQUFBO0FBQ2YsQ0FBQyxFQUpXLGVBQWUsS0FBZixlQUFlLFFBSTFCO0FBRUQsTUFBTSxPQUFPLGNBQWM7SUFtRHZCLFlBQVksS0FBYTtRQWpEbEIsVUFBSyxHQUFVLElBQUksS0FBSyxFQUFFLENBQUM7UUFDM0IsV0FBTSxHQUFvQixlQUFlLENBQUMsSUFBSSxDQUFDO1FBQy9DLFVBQUssR0FBdUIsU0FBUyxDQUFDO1FBQ3RDLFdBQU0sR0FBb0IsZUFBZSxDQUFDLEdBQUcsQ0FBQztRQUM5QyxTQUFJLEdBQXVCLFNBQVMsQ0FBQztRQW1HcEMsZ0JBQVcsR0FBRztZQUNs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