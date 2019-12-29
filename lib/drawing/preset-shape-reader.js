import { Shape } from "./shape.js";
import { Xml } from "../utils/xml.js";
import { ShapeReader } from "./shape-reader.js";
import { PresetShapeFactory } from "./preset-shape-factory.js";
export class PresetShapeReader {
    constructor() {
        this._shapeReader = new ShapeReader();
    }
    readPresetShapeDefinitions(doc) {
        doc.getRootNode().firstChild.childNodes.forEach((child) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                this.readPresetShapeDefinition(child);
            }
        });
    }
    readPresetShapeDefinition(defNode) {
        const shape = new Shape();
        defNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "avLst":
                    this._readShapeGuideList(child, shape);
                    break;
                case "gdLst":
                    this._readShapeGuideList(child, shape);
                    break;
                case "pathLst":
                    this._readPathList(child, shape);
                    break;
                case "ahLst":
                case "rect":
                case "cxnLst":
                case "#text":
                    // Ignore, only used for editing shapes.
                    break;
                default:
                    console.log(`Unknown node ${child.nodeName} encountered during reading of Shape definitions`);
                    break;
            }
        });
        PresetShapeFactory.defineShape(defNode.nodeName, shape);
    }
    _readShapeGuideList(shapeGuideListNode, shape) {
        shapeGuideListNode.childNodes.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                this._readShapeGuide(child, shape);
            }
        });
    }
    _readShapeGuide(shapeGuideNode, shape) {
        const fmla = Xml.getAttribute(shapeGuideNode, "fmla");
        const name = Xml.getAttribute(shapeGuideNode, "name");
        if (fmla !== undefined && name !== undefined) {
            shape.guide.addFormula(fmla, name);
        }
    }
    _readPathList(pathListNode, shape) {
        pathListNode.childNodes.forEach(pathNode => {
            if (pathNode.nodeType === Node.ELEMENT_NODE) {
                this._shapeReader.readPath(pathNode, shape);
            }
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlc2V0LXNoYXBlLXJlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kcmF3aW5nL3ByZXNldC1zaGFwZS1yZWFkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRy9ELE1BQU0sT0FBTyxpQkFBaUI7SUFBOUI7UUFDWSxpQkFBWSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7SUE0RDdDLENBQUM7SUExRFUsMEJBQTBCLENBQUMsR0FBZ0I7UUFDOUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLFVBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDdkQsSUFBSSxLQUFLLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN6QztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLHlCQUF5QixDQUFDLE9BQWE7UUFDMUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUMxQixPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMvQixRQUFRLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ3BCLEtBQUssT0FBTztvQkFDUixJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUN2QyxNQUFNO2dCQUNWLEtBQUssT0FBTztvQkFDUixJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUN2QyxNQUFNO2dCQUNWLEtBQUssU0FBUztvQkFDVixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDakMsTUFBTTtnQkFDVixLQUFLLE9BQU8sQ0FBQztnQkFDYixLQUFLLE1BQU0sQ0FBQztnQkFDWixLQUFLLFFBQVEsQ0FBQztnQkFDZCxLQUFLLE9BQU87b0JBQ1Isd0NBQXdDO29CQUN4QyxNQUFNO2dCQUNWO29CQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEtBQUssQ0FBQyxRQUFRLGtEQUFrRCxDQUFDLENBQUM7b0JBQzlGLE1BQU07YUFDYjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsa0JBQWtCLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVPLG1CQUFtQixDQUFDLGtCQUF3QixFQUFFLEtBQVk7UUFDOUQsa0JBQWtCLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMxQyxJQUFJLEtBQUssQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDdEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDdEM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxlQUFlLENBQUMsY0FBb0IsRUFBRSxLQUFZO1FBQ3RELE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RELE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RELElBQUksSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQzFDLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUN0QztJQUNMLENBQUM7SUFFTyxhQUFhLENBQUMsWUFBa0IsRUFBRSxLQUFZO1FBQ2xELFlBQVksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3ZDLElBQUksUUFBUSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN6QyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDL0M7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSiJ9