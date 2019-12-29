import { DrawingRun, WrapMode } from "./drawing-run.js";
import { ShapeBounds } from "./shape-bounds.js";
import { Xml } from "../utils/xml.js";
import { Picture } from "./picture.js";
import { ChartSpace } from "../chart/chart-space.js";
import { ChartReader } from "../chart/chart-reader.js";
import { ShapeReader } from "./shape-reader.js";
export class DrawingReader {
    static readDrawingRun(drawingNode, docx) {
        let bounds = new ShapeBounds();
        let wrapMode = WrapMode.None;
        const child = drawingNode.childNodes[0];
        if (child.nodeName === "wp:anchor") {
            bounds = ShapeBounds.fromAnchorNode(child);
            wrapMode = WrapMode.TopAndBottom;
        }
        else if (child.nodeName === "wp:inline") {
            bounds = ShapeBounds.fromInlineNode(child);
            wrapMode = WrapMode.Inline;
        }
        const drawing = new DrawingRun(bounds, wrapMode);
        const graphic = Xml.getFirstChildOfName(child, "a:graphic");
        if (graphic !== undefined) {
            const graphicData = Xml.getFirstChildOfName(graphic, "a:graphicData");
            if (graphicData !== undefined) {
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
                        default:
                            console.log(`Don't know how to parse ${childNode.nodeName} during Drawing reading.`);
                            break;
                    }
                });
            }
        }
        return drawing;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2luZy1yZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZHJhd2luZy9kcmF3aW5nLXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN2QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFckQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVoRCxNQUFNLE9BQU8sYUFBYTtJQUdmLE1BQU0sQ0FBQyxjQUFjLENBQUMsV0FBc0IsRUFBRSxJQUFlO1FBQ2hFLElBQUksTUFBTSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFDL0IsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztRQUM3QixNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLElBQUksS0FBSyxDQUFDLFFBQVEsS0FBSyxXQUFXLEVBQUU7WUFDaEMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsUUFBUSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7U0FDcEM7YUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLEtBQUssV0FBVyxFQUFFO1lBQ3ZDLE1BQU0sR0FBRyxXQUFXLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFD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