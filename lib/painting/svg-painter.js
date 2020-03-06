import { Justification } from "../paragraph/par-style.js";
import { Xml } from "../utils/xml.js";
export class SvgPainter {
    constructor(content) {
        const root = document.createElementNS(SvgPainter.svgNS, 'svg');
        const width = content.clientWidth.toString();
        root.setAttribute('id', 'svg');
        root.setAttribute('width', width);
        root.setAttribute('height', '500');
        root.setAttribute('style', 'white-space:pre');
        content.appendChild(root);
        this._svg = root;
        this._root = root;
    }
    get svg() {
        return this._svg;
    }
    paintText(x, y, width, stretched, text, color, justification, fontFamily, fontSize, bold, italic) {
        const newText = document.createElementNS(SvgPainter.svgNS, 'text');
        this._setFont(newText, fontFamily, fontSize, bold, italic);
        this._setColor(newText, color);
        this._setHorizontalAlignment(newText, x, width, justification, stretched);
        this._setVerticalAlignment(newText, y, fontSize);
        const textNode = document.createTextNode(text);
        newText.appendChild(textNode);
        this._svg.appendChild(newText);
        this._lastText = newText;
    }
    measureLastText() {
        let rect;
        if (this._lastText !== undefined) {
            const box = this._lastText.getBBox();
            rect = {
                x: box.x,
                y: box.y,
                width: box.width,
                height: box.height
            };
        }
        else {
            rect = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
        }
        return rect;
    }
    paintLine(x1, y1, x2, y2, color, thickness) {
        const line = document.createElementNS(SvgPainter.svgNS, "line");
        line.setAttribute("x1", x1.toString());
        line.setAttribute("y1", y1.toString());
        line.setAttribute("x2", x2.toString());
        line.setAttribute("y2", y2.toString());
        line.setAttribute("stroke", `#${color}`);
        line.setAttribute("stroke-width", thickness.toString());
        this._svg.appendChild(line);
    }
    paintPolygon(path, fillColor, strokeColor, strokeThickness) {
        const element = document.createElementNS(SvgPainter.svgNS, "path");
        element.setAttribute("d", path);
        if (fillColor !== undefined) {
            element.setAttribute("fill", `#${fillColor}`);
        }
        if (strokeColor !== undefined) {
            element.setAttribute("stroke", `#${strokeColor}`);
        }
        element.setAttribute("stroke-width", `${strokeThickness}`);
        this._svg.appendChild(element);
    }
    paintPicture(x, y, width, height, pic) {
        if (pic !== undefined) {
            const rect = document.createElementNS(SvgPainter.svgNS, "image");
            rect.setAttribute("x", `${x}`);
            rect.setAttribute("y", `${y}`);
            rect.setAttribute("width", `${width}`);
            rect.setAttribute("height", `${height}`);
            this.svg.appendChild(rect);
            pic.getImageUrl().then(url => {
                rect.setAttribute("xlink:href", `${url}`);
                rect.setAttribute("href", `${url}`);
            }).catch(error => {
                console.log(`ERROR during rendering: ${error}`);
            });
        }
    }
    clear() {
        while (this.svg.lastChild) {
            this.svg.removeChild(this.svg.lastChild);
        }
    }
    setWidth(newWidth) {
        const width = Xml.getAttribute(this.svg, "width");
        if (width !== undefined) {
            this._svg.setAttribute("width", `${newWidth}`);
            const root = this._svg.parentElement;
            if (root !== null) {
                root.setAttribute("width", `${newWidth}`);
            }
        }
    }
    ensureHeight(newHeight) {
        const height = Xml.getAttribute(this.svg, "height");
        if (height !== undefined) {
            const heightNum = parseFloat(height);
            const maxY = Math.max(heightNum, newHeight);
            if (maxY > heightNum) {
                this._svg.setAttribute("height", `${maxY}`);
                const root = this._svg.parentElement;
                if (root !== null) {
                    root.setAttribute("height", `${maxY}`);
                }
            }
        }
    }
    startLink(url) {
        const a = document.createElementNS(SvgPainter.svgNS, "a");
        a.setAttribute("href", url);
        this._svg = a;
        this._root.appendChild(this._svg);
    }
    endLink() {
        if (this._svg !== this._root) {
            this._svg = this._root;
        }
    }
    _setFont(textNode, fontFamily, fontSize, bold, italic) {
        textNode.setAttribute('font-family', fontFamily);
        textNode.setAttribute('font-size', fontSize.toString());
        if (bold) {
            textNode.setAttribute('font-weight', 'bold');
        }
        if (italic) {
            textNode.setAttribute('font-style', 'italic');
        }
    }
    _setColor(textNode, color) {
        textNode.setAttribute('fill', `#${color}`);
    }
    _setHorizontalAlignment(textNode, x, width, justification, stretched) {
        switch (justification) {
            case Justification.both:
                textNode.setAttribute('x', x.toString());
                if (stretched) {
                    textNode.setAttribute('textLength', width.toString());
                    textNode.setAttribute('lengthAdjust', 'spacing');
                }
                break;
            case Justification.right:
                const right = x + width;
                textNode.setAttribute('x', right.toString());
                textNode.setAttribute('text-anchor', "end");
                break;
            case Justification.center:
                const center = x + width / 2;
                textNode.setAttribute('x', center.toString());
                textNode.setAttribute('text-anchor', "middle");
                break;
            case Justification.left:
            default:
                textNode.setAttribute('x', x.toString());
                textNode.setAttribute('text-anchor', "start");
                break;
        }
    }
    _setVerticalAlignment(textNode, y, _fontSize) {
        textNode.setAttribute('y', y.toString());
    }
}
SvgPainter.svgNS = 'http://www.w3.org/2000/svg';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ZnLXBhaW50ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFpbnRpbmcvc3ZnLXBhaW50ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV0QyxNQUFNLE9BQU8sVUFBVTtJQU1uQixZQUFZLE9BQW9CO1FBQzVCLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvRCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDOUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBVyxHQUFHO1FBQ1YsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxTQUFTLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxLQUFhLEVBQUUsU0FBa0IsRUFBRSxJQUFZLEVBQUUsS0FBYSxFQUFFLGFBQTRCLEVBQUUsVUFBa0IsRUFBRSxRQUFnQixFQUFFLElBQWEsRUFBRSxNQUFlO1FBQ3JNLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsdUJBQXVCLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0MsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztJQUM3QixDQUFDO0lBRU0sZUFBZTtRQUNsQixJQUFJLElBQWdCLENBQUM7UUFDckIsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtZQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JDLElBQUksR0FBRztnQkFDSCxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ1IsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNSLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSztnQkFDaEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO2FBQ3JCLENBQUM7U0FDTDthQUFNO1lBQ0gsSUFBSSxHQUFHO2dCQUNILENBQUMsRUFBRSxDQUFDO2dCQUNKLENBQUMsRUFBRSxDQUFDO2dCQUNKLEtBQUssRUFBRSxDQUFDO2dCQUNSLE1BQU0sRUFBRSxDQUFDO2FBQ1osQ0FBQztTQUNMO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLFNBQVMsQ0FBQyxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVLEVBQUUsS0FBYSxFQUFFLFNBQWlCO1FBQzdGLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVNLFlBQVksQ0FBQyxJQUFZLEVBQUUsU0FBNkIsRUFBRSxXQUErQixFQUFFLGVBQW1DO1FBQ2pJLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNuRSxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoQyxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDekIsT0FBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1NBQ2pEO1FBQ0QsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQzNCLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksV0FBVyxFQUFFLENBQUMsQ0FBQztTQUNyRDtRQUNELE9BQU8sQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLEdBQUcsZUFBZSxFQUFFLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRU0sWUFBWSxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsS0FBYSxFQUFFLE1BQWMsRUFBRSxHQUFZO1FBQ2pGLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtZQUNuQixNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDYixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFBO1NBQ0w7SUFDTCxDQUFDO0lBRU0sS0FBSztRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUU7WUFDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUMxQztJQUNMLENBQUM7SUFFTSxRQUFRLENBQUMsUUFBZ0I7UUFDNUIsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO1lBQ3JDLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtnQkFDZixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxHQUFHLFFBQVEsRUFBRSxDQUFDLENBQUM7YUFDN0M7U0FDSjtJQUNMLENBQUM7SUFFTSxZQUFZLENBQUMsU0FBaUI7UUFDakMsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3BELElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUN0QixNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDNUMsSUFBSSxJQUFJLEdBQUcsU0FBUyxFQUFFO2dCQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUM1QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztnQkFDckMsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO29CQUNmLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQztpQkFDMUM7YUFDSjtTQUNKO0lBQ0wsQ0FBQztJQUVNLFNBQVMsQ0FBQyxHQUFXO1FBQ3hCLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRU0sT0FBTztRQUNWLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUMxQjtJQUNMLENBQUM7SUFFTyxRQUFRLENBQUMsUUFBaUIsRUFBRSxVQUFrQixFQUFFLFFBQWdCLEVBQUUsSUFBYSxFQUFFLE1BQWU7UUFDcEcsUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDakQsUUFBUSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDeEQsSUFBSSxJQUFJLEVBQUU7WUFDTixRQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNoRDtRQUNELElBQUksTUFBTSxFQUFFO1lBQ1IsUUFBUSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDakQ7SUFDTCxDQUFDO0lBRU8sU0FBUyxDQUFDLFFBQWlCLEVBQUUsS0FBYTtRQUM5QyxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVPLHVCQUF1QixDQUFDLFFBQWlCLEVBQUUsQ0FBUyxFQUFFLEtBQWEsRUFBRSxhQUE0QixFQUFFLFNBQWtCO1FBQ3pILFFBQU8sYUFBYSxFQUFFO1lBQ2xCLEtBQUssYUFBYSxDQUFDLElBQUk7Z0JBQ25CLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLFNBQVMsRUFBRTtvQkFDWCxRQUFRLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztvQkFDdEQsUUFBUSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUM7aUJBQ3BEO2dCQUNELE1BQU07WUFDVixLQUFLLGFBQWEsQ0FBQyxLQUFLO2dCQUNwQixNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUN4QixRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDN0MsUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzVDLE1BQU07WUFDVixLQUFLLGFBQWEsQ0FBQyxNQUFNO2dCQUNyQixNQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDN0IsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQzlDLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUMvQyxNQUFNO1lBQ1YsS0FBSyxhQUFhLENBQUMsSUFBSSxDQUFDO1lBQ3hCO2dCQUNJLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUN6QyxRQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDOUMsTUFBTTtTQUNiO0lBQ0wsQ0FBQztJQUVPLHFCQUFxQixDQUFDLFFBQWlCLEVBQUUsQ0FBUyxFQUFFLFNBQWlCO1FBQ3pFLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLENBQUM7O0FBeEx1QixnQkFBSyxHQUFHLDRCQUE0QixDQUFDIn0=