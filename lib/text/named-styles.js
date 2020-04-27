import { Style } from "./style.js";
import { Xml } from "../utils/xml.js";
export class NamedStyles {
    constructor(part) {
        this.named = {};
        this.doc = part.document;
        this._docDefaultStyle = new Style();
    }
    parseContent() {
        if (this.named["Normal"] === undefined) {
            const root = Xml.getFirstChildOfName(this.doc, "w:styles");
            if (root !== undefined) {
                root.childNodes.forEach(child => {
                    switch (child.nodeName) {
                        case "w:style":
                            const styleType = Xml.getAttribute(child, "w:type");
                            if (styleType !== undefined && styleType !== "numbering") {
                                const style = Style.fromStyleNode(child);
                                const styleId = Xml.getAttribute(child, "w:styleId");
                                if (styleId !== undefined) {
                                    this.named[styleId] = style;
                                }
                            }
                            break;
                        case "w:docDefaults":
                            this._docDefaultStyle = Style.fromDocDefaultsNode(child);
                            break;
                        case "w:latentStyles":
                            // Ignore, UI related.
                            break;
                        default:
                            console.log(`Don't know how to parse ${child.nodeName} during NamedStyle reading.`);
                            break;
                    }
                });
            }
            for (const name in this.named) {
                if (this.named.hasOwnProperty(name)) {
                    const style = this.named[name];
                    style.applyNamedStyles(this);
                }
            }
        }
    }
    get docDefaults() {
        return this._docDefaultStyle;
    }
    getNamedStyle(name) {
        return this.named[name];
    }
    printDebugInfo() {
        for (const name in this.named) {
            if (this.named.hasOwnProperty(name)) {
                const style = this.named[name];
                console.log(`${name}: ${style.toString()}`);
                if (style.parStyle) {
                    console.log(style.parStyle.toString());
                }
                if (style.runStyle) {
                    console.log(style.runStyle.toString());
                }
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmFtZWQtc3R5bGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3RleHQvbmFtZWQtc3R5bGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR3RDLE1BQU0sT0FBTyxXQUFXO0lBS3BCLFlBQVksSUFBYTtRQUhqQixVQUFLLEdBQTZCLEVBQUUsQ0FBQztRQUl6QyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7SUFDeEMsQ0FBQztJQUVNLFlBQVk7UUFDZixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQ3BDLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzNELElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQzVCLFFBQU8sS0FBSyxDQUFDLFFBQVEsRUFBRTt3QkFDbkIsS0FBSyxTQUFTOzRCQUNWLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDOzRCQUNwRCxJQUFJLFNBQVMsS0FBSyxTQUFTLElBQUksU0FBUyxLQUFLLFdBQVcsRUFBRTtnQ0FDdEQsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQ0FDekMsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0NBQ3JELElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtvQ0FDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUM7aUNBQy9COzZCQUNKOzRCQUNELE1BQU07d0JBQ1YsS0FBSyxlQUFlOzRCQUNoQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDOzRCQUN6RCxNQUFNO3dCQUNWLEtBQUssZ0JBQWdCOzRCQUNqQixzQkFBc0I7NEJBQ3RCLE1BQU07d0JBQ1Y7NEJBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsS0FBSyxDQUFDLFFBQVEsNkJBQTZCLENBQUMsQ0FBQzs0QkFDcEYsTUFBTTtxQkFDYjtnQkFDTCxDQUFDLENBQUMsQ0FBQzthQUNOO1lBQ0QsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUMzQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNqQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMvQixLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2hDO2FBQ0o7U0FDSjtJQUNMLENBQUM7SUFFRCxJQUFXLFdBQVc7UUFDbEIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDakMsQ0FBQztJQUVNLGFBQWEsQ0FBQyxJQUFZO1FBQzdCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRU0sY0FBYztRQUNqQixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDM0IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDakMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksS0FBSyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7b0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2lCQUMxQztnQkFDRCxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7b0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2lCQUMxQzthQUNKO1NBQ0o7SUFDTCxDQUFDO0NBQ0oifQ==