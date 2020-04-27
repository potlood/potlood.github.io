import { Xml } from "./utils/xml.js";
import { Metrics } from "./utils/metrics.js";
export class Section {
    // TODO: SectionType, PageOrientation and PageNumberFormat
    constructor(_doc, sectionNode) {
        this.sectionNode = sectionNode;
    }
    get pageHeight() {
        this.parseContent();
        return this._pageHeight;
    }
    get pageWidth() {
        this.parseContent();
        return this._pageWidth;
    }
    get marginTop() {
        this.parseContent();
        return this._marginTop;
    }
    get marginLeft() {
        this.parseContent();
        return this._marginLeft;
    }
    get marginBottom() {
        this.parseContent();
        return this._marginBottom;
    }
    get marginRight() {
        this.parseContent();
        return this._marginRight;
    }
    parseContent() {
        if (this._pageWidth === undefined) {
            this.sectionNode.childNodes.forEach(child => {
                switch (child.nodeName) {
                    case "w:pgSz":
                        const width = Xml.getAttribute(child, "w:w");
                        if (width !== undefined) {
                            this._pageWidth = Metrics.convertTwipsToPixels(parseInt(width, 10));
                        }
                        const height = Xml.getAttribute(child, "w:h");
                        if (height !== undefined) {
                            this._pageHeight = Metrics.convertTwipsToPixels(parseInt(height, 10));
                        }
                        break;
                    case "w:pgMar":
                        const top = Xml.getAttribute(child, "w:top");
                        if (top !== undefined) {
                            this._marginTop = Metrics.convertTwipsToPixels(parseInt(top));
                        }
                        const left = Xml.getAttribute(child, "w:left");
                        if (left !== undefined) {
                            this._marginLeft = Metrics.convertTwipsToPixels(parseInt(left));
                        }
                        const bottom = Xml.getAttribute(child, "w:bottom");
                        if (bottom !== undefined) {
                            this._marginBottom = Metrics.convertTwipsToPixels(parseInt(bottom));
                        }
                        const right = Xml.getAttribute(child, "w:right");
                        if (right !== undefined) {
                            this._marginRight = Metrics.convertTwipsToPixels(parseInt(right));
                        }
                        break;
                    case "w:textDirection":
                    case "w:docGrid":
                    case "w:pgNumType":
                    case "w:formProt":
                    case "w:type":
                    case "w:headerReference":
                    case "w:footerReference":
                    case "w:titlePg":
                    case "w:cols":
                        // Ignore
                        break;
                    default:
                        console.log(`Don't know how to parse ${child.nodeName} during Section reading.`);
                        break;
                }
            });
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFN0MsTUFBTSxPQUFPLE9BQU87SUFRaEIsMERBQTBEO0lBRTFELFlBQVksSUFBZSxFQUFFLFdBQXNCO1FBQy9DLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQ25DLENBQUM7SUFFRCxJQUFXLFVBQVU7UUFDakIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUM1QixDQUFDO0lBRUQsSUFBVyxTQUFTO1FBQ2hCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQVcsU0FBUztRQUNoQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDcEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFXLFVBQVU7UUFDakIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUM1QixDQUFDO0lBRUQsSUFBVyxZQUFZO1FBQ25CLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDOUIsQ0FBQztJQUVELElBQVcsV0FBVztRQUNsQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDcEIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzdCLENBQUM7SUFFTyxZQUFZO1FBQ2hCLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7WUFDL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN4QyxRQUFPLEtBQUssQ0FBQyxRQUFRLEVBQUU7b0JBQ25CLEtBQUssUUFBUTt3QkFDVCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzt3QkFDN0MsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFOzRCQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7eUJBQ3ZFO3dCQUNELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUM5QyxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7NEJBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDekU7d0JBQ0QsTUFBTTtvQkFDVixLQUFLLFNBQVM7d0JBQ1YsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7d0JBQzdDLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTs0QkFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7eUJBQ2pFO3dCQUNELE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO3dCQUMvQyxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7NEJBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3lCQUNuRTt3QkFDRCxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQzt3QkFDbkQsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFOzRCQUN0QixJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt5QkFDdkU7d0JBQ0QsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7d0JBQ2pELElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTs0QkFDckIsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7eUJBQ3JFO3dCQUNELE1BQU07b0JBQ1YsS0FBSyxpQkFBaUIsQ0FBQztvQkFDdkIsS0FBSyxXQUFXLENBQUM7b0JBQ2pCLEtBQUssYUFBYSxDQUFDO29CQUNuQixLQUFLLFlBQVksQ0FBQztvQkFDbEIsS0FBSyxRQUFRLENBQUM7b0JBQ2QsS0FBSyxtQkFBbUIsQ0FBQztvQkFDekIsS0FBSyxtQkFBbUIsQ0FBQztvQkFDekIsS0FBSyxXQUFXLENBQUM7b0JBQ2pCLEtBQUssUUFBUTt3QkFDVCxTQUFTO3dCQUNULE1BQU07b0JBQ1Y7d0JBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsS0FBSyxDQUFDLFFBQVEsMEJBQTBCLENBQUMsQ0FBQzt3QkFDakYsTUFBTTtpQkFDYjtZQUNMLENBQUMsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0NBQ0oifQ==