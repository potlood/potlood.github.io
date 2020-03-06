import { DrawingRun, WrapMode } from "./drawing-run.js";
import { ShapeBounds } from "./shape-bounds.js";
import { Xml } from "../utils/xml.js";
import { Picture } from "./picture.js";
import { ChartSpace } from "../chart/chart-space.js";
import { ChartReader } from "../chart/chart-reader.js";
import { ShapeReader } from "./shape-reader.js";
import { ShapeBoundsReader } from "./shape-bounds-reader.js";
export class DrawingReader {
    static readDrawingRun(drawingNode, docx) {
        let bounds = new ShapeBounds();
        let wrapMode = WrapMode.None;
        const child = drawingNode.childNodes[0];
        if (child.nodeName === "wp:anchor") {
            bounds = ShapeBoundsReader.fromAnchorNode(child);
            wrapMode = WrapMode.TopAndBottom;
        }
        else if (child.nodeName === "wp:inline") {
            bounds = ShapeBoundsReader.fromInlineNode(child);
        }
        const drawing = new DrawingRun(bounds, wrapMode);
        const graphic = Xml.getFirstChildOfName(child, "a:graphic");
        if (graphic !== undefined) {
            const graphicData = Xml.getFirstChildOfName(graphic, "a:graphicData");
            if (graphicData !== undefined) {
                this._readGraphicData(drawing, graphicData, docx);
            }
        }
        return drawing;
    }
    static _readGraphicData(drawing, graphicData, docx) {
        graphicData.childNodes.forEach(childNode => {
            switch (childNode.nodeName) {
                case "pic:pic":
                    drawing.picture = Picture.fromPicNode(childNode, docx);
                    break;
                case "c:chart":
                    const relationship = Xml.getAttribute(childNode, "r:id");
                    if (relationship !== undefined && docx.relationships !== undefined) {
                        const chartTarget = docx.relationships.getTarget(relationship);
                        drawing.chart = this.readChartFromPart(docx.pack.loadPartAsXml(`word/${chartTarget}`));
                    }
                    break;
                case "wps:wsp":
                    drawing.shape = this.shapeReader.readShape(childNode);
                    break;
                case "wpg:wgp":
                    this._readGraphicData(drawing, childNode, docx);
                    break;
                case "wpg:grpSpPr":
                case "wpg:cNvGrpSpPr":
                    // TODO: Imeplement style for shape group.
                    break;
                default:
                    console.log(`Don't know how to parse ${childNode.nodeName} during Drawing reading.`);
                    break;
            }
        });
    }
    static readChartFromPart(promise) {
        const space = new ChartSpace();
        const readingPromise = new Promise((resolve, reject) => {
            promise.then(part => {
                this.readChartFromDocument(part.document, space);
                resolve();
            }).catch(err => {
                reject(err);
            });
        });
        space.setPromise(readingPromise);
        return space;
    }
    static readChartFromDocument(doc, space) {
        const chartSpaceNode = doc.getRootNode().firstChild;
        if (chartSpaceNode !== null) {
            return ChartReader.readChartFromNode(chartSpaceNode, space);
        }
        else {
            console.log('Failed to find chart');
            return new ChartSpace();
        }
    }
}
DrawingReader.shapeReader = new ShapeReader();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2luZy1yZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZHJhd2luZy9kcmF3aW5nLXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN2QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFckQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUU3RCxNQUFNLE9BQU8sYUFBYTtJQUdmLE1BQU0sQ0FBQyxjQUFjLENBQUMsV0FBc0IsRUFBRSxJQUFlO1FBQ2hFLElBQUksTUFBTSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFDL0IsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztRQUM3QixNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLElBQUksS0FBSyxDQUFDLFFBQVEsS0FBSyxXQUFXLEVBQUU7WUFDaEMsTUFBTSxHQUFHLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqRCxRQUFRLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQztTQUNwQzthQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsS0FBSyxXQUFXLEVBQUU7WUFDdkMsTUFBTSxHQUFHLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxL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