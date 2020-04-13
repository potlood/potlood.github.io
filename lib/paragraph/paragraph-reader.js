import { Xml } from "../utils/xml.js";
import { Paragraph } from "./paragraph.js";
import { TextRun } from "../text/text-run.js";
import { TextReader } from "../text/text-reader.js";
import { ParStyle } from "./par-style.js";
import { DrawingReader } from "../drawing/drawing-reader.js";
import { InSequence } from "../utils/in-sequence.js";
import { NumberingRun } from "../numbering/numbering-run.js";
import { MathReader } from "../math/math-reader.js";
export class ParagraphReader {
    static readStructuredDocumentTag(docx, sdtNode) {
        const pars = [];
        const contentNode = Xml.getFirstChildOfName(sdtNode, "w:sdtContent");
        if (contentNode !== undefined) {
            contentNode.childNodes.forEach(child => {
                switch (child.nodeName) {
                    case "w:p":
                        pars.push(ParagraphReader.readParagraph(docx, child));
                        break;
                    default:
                        // Ignore
                        break;
                }
            });
        }
        return pars;
    }
    static readParagraph(docx, pNode) {
        let numberingRun;
        let linkTarget = undefined;
        const runs = [];
        const parStyle = this.readStyle(docx, pNode);
        if (parStyle !== undefined && parStyle.numStyle !== undefined) {
            numberingRun = new NumberingRun(parStyle.numStyle);
        }
        const textStyle = parStyle.clone();
        textStyle.numStyle = undefined;
        pNode.childNodes.forEach(node => {
            linkTarget = undefined;
            if (node.nodeName === "w:hyperlink") {
                const linkId = Xml.getAttribute(node, "r:id");
                if (linkId !== undefined) {
                    linkTarget = docx.relationships.getTarget(linkId);
                }
                const firstChild = node.firstChild;
                if (firstChild !== null) {
                    node = firstChild;
                }
            }
            if (node.nodeName === "w:r") {
                node.childNodes.forEach(child => {
                    if (child.nodeName === "w:drawing") {
                        const drawing = DrawingReader.readDrawingRun(child, docx);
                        runs.push(drawing);
                    }
                    if (child.nodeName === "mc:AlternateContent") {
                        const choiceNode = Xml.getFirstChildOfName(child, "mc:Choice");
                        if (choiceNode !== undefined) {
                            const chosenNode = Xml.getFirstChildOfName(choiceNode, "w:drawing");
                            if (chosenNode !== undefined) {
                                runs.push(DrawingReader.readDrawingRun(chosenNode, docx));
                            }
                        }
                    }
                });
                // Try to load text.
                const run = TextReader.readTextRun(node, textStyle, docx.styles);
                run.inParagraph = InSequence.Middle;
                run.linkTarget = linkTarget;
                runs.push(run);
            }
            if (node.nodeName === "m:oMath") {
                const mathRun = MathReader.fromMathNode(node);
                runs.push(mathRun);
            }
        });
        const firstRun = numberingRun || runs[0];
        if (runs.length == 1 && firstRun instanceof TextRun) {
            firstRun.inParagraph = InSequence.Only;
        }
        else if (runs.length > 0) {
            if (firstRun instanceof TextRun) {
                firstRun.inParagraph = InSequence.First;
            }
            const lastRun = runs[runs.length - 1];
            if (lastRun instanceof TextRun) {
                lastRun.inParagraph = InSequence.Last;
            }
        }
        return new Paragraph(runs, numberingRun);
    }
    static readStyle(docx, pNode) {
        const parPrNode = Xml.getFirstChildOfName(pNode, "w:pPr");
        if (parPrNode !== undefined) {
            const parStyle = ParStyle.fromParPresentationNode(parPrNode);
            parStyle.applyNamedStyles(docx.styles);
            parStyle.applyNumberings(docx.numberings);
            return parStyle;
        }
        return new ParStyle();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYWdyYXBoLXJlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYXJhZ3JhcGgvcGFyYWdyYXBoLXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdEMsT0FBTyxFQUFFLFNBQVMsRUFBUSxNQUFNLGdCQUFnQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFcEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDckQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzdELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUVwRCxNQUFNLE9BQU8sZUFBZTtJQUNqQixNQUFNLENBQUMseUJBQXlCLENBQUMsSUFBZSxFQUFFLE9BQWE7UUFDbEUsTUFBTSxJQUFJLEdBQWdCLEVBQUUsQ0FBQztRQUM3QixNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3JFLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUMzQixXQUFXLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDbkMsUUFBUSxLQUFLLENBQUMsUUFBUSxFQUFFO29CQUNwQixLQUFLLEtBQUs7d0JBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUN0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