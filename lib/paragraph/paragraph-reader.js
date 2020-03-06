import { Xml } from "../utils/xml.js";
import { Paragraph } from "./paragraph.js";
import { TextRun } from "../text/text-run.js";
import { TextReader } from "../text/text-reader.js";
import { ParStyle } from "./par-style.js";
import { DrawingReader } from "../drawing/drawing-reader.js";
import { InSequence } from "../utils/in-sequence.js";
import { NumberingRun } from "../numbering/numbering-run.js";
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
        if (parStyle !== undefined && parStyle._numStyle !== undefined) {
            numberingRun = new NumberingRun(parStyle._numStyle);
        }
        const textStyle = parStyle.clone();
        textStyle._numStyle = undefined;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYWdyYXBoLXJlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYXJhZ3JhcGgvcGFyYWdyYXBoLXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHcEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDckQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBRTdELE1BQU0sT0FBTyxlQUFlO0lBQ2pCLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxJQUFlLEVBQUUsT0FBYTtRQUNsRSxNQUFNLElBQUksR0FBZ0IsRUFBRSxDQUFDO1FBQzdCLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDckUsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQzNCLFdBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNuQyxRQUFRLEtBQUssQ0FBQyxRQUFRLEVBQUU7b0JBQ3BCLEtBQUssS0FBSzt3QkFDTixJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ3RELE1BQU07b0JBQ1Y7d0JBQ0ksU0FBUzt3QkFDVCxNQUFNO2lCQUNiO1lB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