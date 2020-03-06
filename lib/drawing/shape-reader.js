import { Shape } from "./shape.js";
import { Xml } from "../utils/xml.js";
import { PresetShapeFactory } from "./preset-shape-factory.js";
import { PointGuide } from "./point-guide.js";
export class ShapeReader {
    readShape(shapeNode) {
        let shape = new Shape();
        let fillColor = undefined;
        let lineColor = undefined;
        const presentationNode = Xml.getFirstChildOfName(shapeNode, "wps:spPr");
        if (presentationNode !== undefined) {
            presentationNode.childNodes.forEach(child => {
                switch (child.nodeName) {
                    case "a:custGeom":
                        shape = this._readCustomShape(child);
                        break;
                    case "a:prstGeom":
                        shape = this._readPresetShape(child);
                        break;
                    case "a:solidFill":
                        fillColor = this._readFillColor(child);
                        break;
                    case "a:ln":
                        const firstChild = child.firstChild;
                        if (firstChild !== null) {
                            lineColor = this._readFillColor(child.firstChild);
                        }
                        break;
                    case "a:noFill":
                        fillColor = undefined;
                        break;
                    case "a:xfrm":
                        // Ignore
                        break;
                    default:
                        console.log(`Don't know how to parse ${child.nodeName} during Shape reading.`);
                        break;
                }
            });
        }
        if (shape !== undefined) {
            shape.lineColor = lineColor;
            shape.fillColor = fillColor;
        }
        return shape;
    }
    readPath(pathNode, shape) {
        let filledIn = true;
        let stroked = true;
        const fill = Xml.getAttribute(pathNode, "fill");
        if (fill !== undefined) {
            filledIn = fill !== "none";
        }
        const stroke = Xml.getAttribute(pathNode, "stroke");
        if (stroke !== undefined) {
            stroked = Xml.attributeAsBoolean(stroke);
        }
        shape.addPath(filledIn, stroked);
        pathNode.childNodes.forEach(segmentNode => {
            if (segmentNode.nodeType === Node.ELEMENT_NODE) {
                switch (segmentNode.nodeName) {
                    case "a:arcTo":
                    case "arcTo":
                        this._addAngle(segmentNode, shape);
                        break;
                    case "a:moveTo":
                    case "moveTo":
                        const movePointNode = Xml.getFirstChildOfName(segmentNode, ["pt", "a:pt"]);
                        if (movePointNode !== undefined) {
                            shape.addSegmentMove(this._readPoint(movePointNode));
                        }
                        else {
                            console.log("Invalid move-to path segment encountered.");
                        }
                        break;
                    case "a:lnTo":
                    case "lnTo":
                        const linePointNode = Xml.getFirstChildOfName(segmentNode, ["pt", "a:pt"]);
                        if (linePointNode !== undefined) {
                            shape.addSegmentLine(this._readPoint(linePointNode));
                        }
                        else {
                            console.log("Invalid line-to path segment encountered.");
                        }
                        break;
                    case "a:cubicBezTo":
                    case "cubicBezTo":
                        this._addCubicBezier(segmentNode, shape);
                        break;
                    case "a:quadBezTo":
                    case "quadBezTo":
                        this._addQuadBezier(segmentNode, shape);
                        break;
                    case "a:close":
                    case "close":
                        shape.addSegmentClose();
                        break;
                    default:
                        console.log(`Unknown path segment ${segmentNode.nodeName} encountered during reading of Shape`);
                        break;
                }
            }
        });
    }
    _readPresetShape(presetNode) {
        let shape = undefined;
        const name = Xml.getAttribute(presetNode, "prst");
        if (name !== undefined) {
            shape = ShapeReader._presetFactory.createShape(name);
        }
        return shape;
    }
    _readCustomShape(customNode) {
        let shape = undefined;
        const pathListNode = Xml.getFirstChildOfName(customNode, "a:pathLst");
        if (pathListNode !== undefined) {
            const pathNode = Xml.getFirstChildOfName(pathListNode, "a:path");
            if (pathNode !== undefined) {
                shape = new Shape();
                this.readPath(pathNode, shape);
                const widthAttr = Xml.getAttribute(pathNode, "w");
                if (widthAttr !== undefined) {
                    shape.width = parseInt(widthAttr);
                }
                const heightAttr = Xml.getAttribute(pathNode, "h");
                if (heightAttr !== undefined) {
                    shape.height = parseInt(heightAttr);
                }
            }
        }
        return shape;
    }
    _readFillColor(fillNode) {
        let color = undefined;
        const colorNode = fillNode.firstChild;
        if (colorNode !== null) {
            color = Xml.getStringValue(colorNode);
        }
        return color;
    }
    _addAngle(segmentNode, shape) {
        const sweepAngle = Xml.getAttribute(segmentNode, "swAng");
        const startAngle = Xml.getAttribute(segmentNode, "stAng");
        const radiusX = Xml.getAttribute(segmentNode, "wR");
        const radiusY = Xml.getAttribute(segmentNode, "hR");
        if (sweepAngle !== undefined && startAngle !== undefined && radiusX !== undefined && radiusY !== undefined) {
            shape.addSegmentArc(sweepAngle, startAngle, radiusX, radiusY);
        }
    }
    _addQuadBezier(segmentNode, shape) {
        const childNodes = segmentNode.childNodes;
        if (childNodes.length === 3) {
            const endPoint = this._readPoint(childNodes[1]);
            const control = this._readPoint(childNodes[0]);
            shape.addSegmentQuadBezier(endPoint, control);
        }
    }
    _addCubicBezier(segmentNode, shape) {
        const childNodes = segmentNode.childNodes;
        if (childNodes.length === 3) {
            const endPoint = this._readPoint(childNodes[1]);
            const control1 = this._readPoint(childNodes[0]);
            const control2 = this._readPoint(childNodes[2]);
            shape.addSegmentCubicBezier(endPoint, control1, control2);
        }
    }
    _readPoint(pointNode) {
        let x = "0";
        let y = "0";
        const xAttr = Xml.getAttribute(pointNode, "x");
        const yAttr = Xml.getAttribute(pointNode, "y");
        if (xAttr !== undefined) {
            x = xAttr;
        }
        if (yAttr !== undefined) {
            y = yAttr;
        }
        return new PointGuide(x, y);
    }
}
ShapeReader._presetFactory = new PresetShapeFactory();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcGUtcmVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RyYXdpbmcvc2hhcGUtcmVhZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3RDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUU5QyxNQUFNLE9BQU8sV0FBVztJQUdiLFNBQVMsQ0FBQyxTQUFlO1FBQzVCLElBQUksS0FBSyxHQUFzQixJQUFJLEtBQUssRUFBRSxDQUFDO1FBQzNDLElBQUksU0FBUyxHQUF1QixTQUFTLENBQUM7UUFDOUMsSUFBSSxTQUFTLEdBQXVCLFNBQVMsQ0FBQztRQUM5QyxNQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDeEUsSUFBSSxnQkFBZ0IsS0FBSyxTQUFTLEVBQUU7WUFDaEMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDeEMsUUFBTyxLQUFLLENBQUMsUUFBUSxFQUFFO29CQUNuQixLQUFLLFlBQVk7d0JBQ2IsS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDckMsTUFBTTtvQkFDVixLQUFLLFlBQVk7d0JBQ2IsS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDckMsTUFBTTtvQkFDVixLQUFLLGFBQWE7d0JBQ2QsU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ3ZDLE1BQU07b0JBQ1YsS0FBSyxNQUFNO3dCQUNQLE1B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