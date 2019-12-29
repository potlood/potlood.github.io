import { Xml } from "../utils/xml.js";
import { Paragraph } from "./paragraph.js";
import { TextRun } from "../text/text-run.js";
import { TextReader } from "../text/text-reader.js";
import { ParStyle } from "./par-style.js";
import { DrawingReader } from "../drawing/drawing-reader.js";
import { InSequence } from "../utils/in-sequence.js";
export class ParagraphReader {
    static readParagraph(docx, pNode) {
        let numberingRun;
        let linkTarget = undefined;
        const runs = [];
        const parStyle = this.readStyle(docx, pNode);
        if (parStyle !== undefined && parStyle._numStyle !== undefined) {
            numberingRun = new TextRun([parStyle._numStyle.getPrefixText()], parStyle._numStyle.style);
        }
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
                const run = TextReader.readTextRun(node, parStyle, docx.styles);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYWdyYXBoLXJlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYXJhZ3JhcGgvcGFyYWdyYXBoLXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHcEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFckQsTUFBTSxPQUFPLGVBQWU7SUFDakIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFlLEVBQUUsS0FBVztRQUNwRCxJQUFJLFlBQWlDLENBQUM7UUFDdEMsSUFBSSxVQUFVLEdBQXVCLFNBQVMsQ0FBQztRQUMvQyxNQUFNLElBQUksR0FBNkIsRUFBRSxDQUFDO1FBQzFDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdDLElBQUksUUFBUSxLQUFLLFNBQVMsSUFBSSxRQUFRLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtZQUM1RCxZQUFZLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM5RjtRQUNELEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVCLFVBQVUsR0FBRyxTQUFT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