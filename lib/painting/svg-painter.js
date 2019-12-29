import { Justification } from "../paragraph/par-style.js";
import { Xml } from "../utils/xml.js";
export class SvgPainter {
    constructor(content) {
        const root = document.createElementNS(SvgPainter.svgNS, 'svg');
        const width = content.clientWidth.toString();
        root.setAttribute('id', 'svg');
        root.setAttribute('width', width);
        root.setAttribute('height', '500');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ZnLXBhaW50ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFpbnRpbmcvc3ZnLXBhaW50ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV0QyxNQUFNLE9BQU8sVUFBVTtJQU1uQixZQUFZLE9BQW9CO1FBQzVCLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvRCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQVcsR0FBRztRQUNWLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sU0FBUyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsS0FBYSxFQUFFLFNBQWtCLEVBQUUsSUFBWSxFQUFFLEtBQWEsRUFBRSxhQUE0QixFQUFFLFVBQWtCLEVBQUUsUUFBZ0IsRUFBRSxJQUFhLEVBQUUsTUFBZTtRQUNyTSxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUs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