import { DashMode } from "./i-painter.js";
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
    paintLine(x1, y1, x2, y2, color, thickness, dashing) {
        const line = document.createElementNS(SvgPainter.svgNS, "line");
        line.setAttribute("x1", x1.toString());
        line.setAttribute("y1", y1.toString());
        line.setAttribute("x2", x2.toString());
        line.setAttribute("y2", y2.toString());
        line.setAttribute("stroke", `#${color}`);
        line.setAttribute("stroke-width", thickness.toString());
        this._setDashing(line, dashing);
        this._svg.appendChild(line);
    }
    paintPolygon(path, fillColor, strokeColor, strokeThickness, dashing) {
        const element = document.createElementNS(SvgPainter.svgNS, "path");
        element.setAttribute("d", path);
        if (fillColor !== undefined) {
            element.setAttribute("fill", `#${fillColor}`);
        }
        if (strokeColor !== undefined) {
            element.setAttribute("stroke", `#${strokeColor}`);
        }
        element.setAttribute("stroke-width", `${strokeThickness}`);
        this._setDashing(element, dashing);
        this._svg.appendChild(element);
    }
    paintPicture(x, y, width, height, pic) {
        if (pic !== undefined) {
            pic.getImageUrl().then(url => {
                if (url instanceof SVGElement) {
                    const g = document.createElementNS(SvgPainter.svgNS, "g");
                    url.setAttribute("x", `${x}`);
                    url.setAttribute("y", `${y}`);
                    url.setAttribute("width", `${width}`);
                    url.setAttribute("height", `${height}`);
                    this.svg.appendChild(g);
                    g.appendChild(url);
                }
                else {
                    const image = document.createElementNS(SvgPainter.svgNS, "image");
                    image.setAttribute("x", `${x}`);
                    image.setAttribute("y", `${y}`);
                    image.setAttribute("width", `${width}`);
                    image.setAttribute("height", `${height}`);
                    this.svg.appendChild(image);
                    image.setAttribute("xlink:href", `${url}`);
                    image.setAttribute("href", `${url}`);
                }
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
    _setDashing(node, dashing) {
        switch (dashing) {
            case DashMode.Dashed:
                node.setAttribute("stroke-dasharray", "5 3");
                break;
            case DashMode.LongDash:
                node.setAttribute("stroke-dasharray", "8 3");
                break;
            case DashMode.Dotted:
                node.setAttribute("stroke-dasharray", "1");
                break;
            case DashMode.DashedSmallGap:
                node.setAttribute("stroke-dasharray", "5 2");
                break;
            case DashMode.DotDash:
                node.setAttribute("stroke-dasharray", "6 2 2 2");
                break;
            case DashMode.DotDotDash:
                node.setAttribute("stroke-dasharray", "6 2 2 2 2 2");
                break;
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ZnLXBhaW50ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFpbnRpbmcvc3ZnLXBhaW50ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF3QixRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFMUQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXRDLE1BQU0sT0FBTyxVQUFVO0lBTW5CLFlBQVksT0FBb0I7UUFDNUIsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9ELE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUM5QyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFXLEdBQUc7UUFDVixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVNLFNBQVMsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLEtBQWEsRUFBRSxTQUFrQixFQUFFLElBQVksRUFBRSxLQUFhLEVBQUUsYUFBNEIsRUFBRSxVQUFrQixFQUFFLFFBQWdCLEVBQUUsSUFBYSxFQUFFLE1BQWU7UUFDck0sTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDMUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDakQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0lBQzdCLENBQUM7SUFFTSxlQUFlO1FBQ2xCLElBQUksSUFBZ0IsQ0FBQztRQUNyQixJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFO1lBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckMsSUFBSSxHQUFHO2dCQUNILENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDUixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ1IsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLO2dCQUNoQixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU07YUFDckIsQ0FBQztTQUNMO2FBQU07WUFDSCxJQUFJLEdBQUc7Z0JBQ0gsQ0FBQyxFQUFFLENBQUM7Z0JBQ0osQ0FBQyxFQUFFLENBQUM7Z0JBQ0osS0FBSyxFQUFFLENBQUM7Z0JBQ1IsTUFBTSxFQUFFLENBQUM7YUFDWixDQUFDO1NBQ0w7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sU0FBUyxDQUFDLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxLQUFhLEVBQUUsU0FBaUIsRUFBRSxPQUFpQjtRQUNoSCxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTSxZQUFZLENBQUMsSUFBWSxFQUFFLFNBQTZCLEVBQUUsV0FBK0IsRUFBRSxlQUFtQyxFQUFFLE9BQWlCO1FBQ3BKLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNuRSxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoQyxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDekIsT0FBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1NBQ2pEO1FBQ0QsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQzNCLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksV0FBVyxFQUFFLENBQUMsQ0FBQztTQUNyRDtRQUNELE9BQU8sQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLEdBQUcsZUFBZSxFQUFFLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRU0sWUFBWSxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsS0FBYSxFQUFFLE1BQWMsRUFBRSxHQUFZO1FBQ2pGLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtZQUNuQixHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUN6QixJQUFJLEdBQUcsWUFBWSxVQUFVLEVBQUU7b0JBQzNCLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDMUQsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUM5QixHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzlCLEdBQUcsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztvQkFDdEMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDO29CQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDdEI7cUJBQU07b0JBQ0gsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUNsRSxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2hDLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDaEMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO29CQUN4QyxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7b0JBQzFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM1QixLQUFLLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7b0JBQzNDLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztpQkFDeEM7WUFDTCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNwRCxDQUFDLENBQUMsQ0FBQTtTQUNMO0lBQ0wsQ0FBQztJQUVNLEtBQUs7UUFDUixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDMUM7SUFDTCxDQUFDO0lBRU0sUUFBUSxDQUFDLFFBQWdCO1FBQzVCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRCxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEdBQUcsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUMvQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUNyQyxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2FBQzdDO1NBQ0o7SUFDTCxDQUFDO0lBRU0sWUFBWSxDQUFDLFNBQWlCO1FBQ2pDLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNwRCxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDdEIsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzVDLElBQUksSUFBSSxHQUFHLFNBQVMsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDNUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7Z0JBQ3JDLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtvQkFDZixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDLENBQUM7aUJBQzFDO2FBQ0o7U0FDSjtJQUNMLENBQUM7SUFFTSxTQUFTLENBQUMsR0FBVztRQUN4QixNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVNLE9BQU87UUFDVixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRTtZQUMxQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDMUI7SUFDTCxDQUFDO0lBRU8sUUFBUSxDQUFDLFFBQWlCLEVBQUUsVUFBa0IsRUFBRSxRQUFnQixFQUFFLElBQWEsRUFBRSxNQUFlO1FBQ3BHLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2pELFFBQVEsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELElBQUksSUFBSSxFQUFFO1lBQ04sUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDaEQ7UUFDRCxJQUFJLE1BQU0sRUFBRTtZQUNSLFFBQVEsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ2pEO0lBQ0wsQ0FBQztJQUVPLFNBQVMsQ0FBQyxRQUFpQixFQUFFLEtBQWE7UUFDOUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTyxXQUFXLENBQUMsSUFBYSxFQUFFLE9BQWlCO1FBQ2hELFFBQU8sT0FBTyxFQUFFO1lBQ1osS0FBSyxRQUFRLENBQUMsTUFBTTtnQkFDaEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDN0MsTUFBTTtZQUNWLEtBQUssUUFBUSxDQUFDLFFBQVE7Z0JBQ2xCLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzdDLE1BQU07WUFDVixLQUFLLFFBQVEsQ0FBQyxNQUFNO2dCQUNoQixJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMzQyxNQUFNO1lBQ1YsS0FBSyxRQUFRLENBQUMsY0FBYztnQkFDeEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDN0MsTUFBTTtZQUNWLEtBQUssUUFBUSxDQUFDLE9BQU87Z0JBQ2pCLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ2pELE1BQU07WUFDVixLQUFLLFFBQVEsQ0FBQyxVQUFVO2dCQUNwQixJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO2dCQUNyRCxNQUFNO1NBQ2I7SUFDTCxDQUFDO0lBRU8sdUJBQXVCLENBQUMsUUFBaUIsRUFBRSxDQUFTLEVBQUUsS0FBYSxFQUFFLGFBQTRCLEVBQUUsU0FBa0I7UUFDekgsUUFBTyxhQUFhLEVBQUU7WUFDbEIsS0FBSyxhQUFhLENBQUMsSUFBSTtnQkFDbkIsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQ3pDLElBQUksU0FBUyxFQUFFO29CQUNYLFFBQVEsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUN0RCxRQUFRLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQztpQkFDcEQ7Z0JBQ0QsTUFBTTtZQUNWLEtBQUssYUFBYSxDQUFDLEtBQUs7Z0JBQ3BCLE1BQU0sS0FBSyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQ3hCLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUM3QyxRQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDNUMsTUFBTTtZQUNWLEtBQUssYUFBYSxDQUFDLE1BQU07Z0JBQ3JCLE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QixRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDOUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQy9DLE1BQU07WUFDVixLQUFLLGFBQWEsQ0FBQyxJQUFJLENBQUM7WUFDeEI7Z0JBQ0ksUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQ3pDLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUM5QyxNQUFNO1NBQ2I7SUFDTCxDQUFDO0lBRU8scUJBQXFCLENBQUMsUUFBaUIsRUFBRSxDQUFTLEVBQUUsU0FBaUI7UUFDekUsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDN0MsQ0FBQzs7QUEzTnVCLGdCQUFLLEdBQUcsNEJBQTRCLENBQUMifQ==