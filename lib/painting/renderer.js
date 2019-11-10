import { VirtualFlow } from '../utils/virtual-flow.js';
import { Paragraph } from '../paragraph/paragraph.js';
import { SvgPainter } from './svg-painter.js';
import { TableRenderer } from '../table/table-renderer.js';
import { ParagraphRenderer } from '../paragraph/paragraph-renderer.js';
export class Renderer {
    constructor(content) {
        this._painter = new SvgPainter(content);
        this._paragraphRenderer = new ParagraphRenderer(this._painter);
        this._tableRenderer = new TableRenderer(this._painter, this._paragraphRenderer);
    }
    renderDocument(docx) {
        const flow = VirtualFlow.fromSection(docx.section);
        docx.paragraphs.forEach(parOrTable => {
            parOrTable.performLayout(flow);
        });
        docx.paragraphs.forEach(parOrTable => {
            if (parOrTable instanceof Paragraph) {
                this._paragraphRenderer.renderParagraph(parOrTable);
            }
            else {
                this._tableRenderer.renderTable(parOrTable);
            }
        });
        return flow.getY();
    }
    clear() {
        this._painter.clear();
    }
    ensureHeight(newHeight) {
        this._painter.ensureHeight(newHeight);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFpbnRpbmcvcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFOUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBRXZFLE1BQU0sT0FBTyxRQUFRO0lBS2pCLFlBQVksT0FBb0I7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFFTSxjQUFjLENBQUMsSUFBZTtRQUNqQyxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNqQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDakMsSUFBSSxVQUFVLFlBQVksU0FBUyxFQUFFO2dCQUNqQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ3ZEO2lCQUFNO2dCQUNILElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQy9DO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRU0sS0FBSztRQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVNLFlBQVksQ0FBQyxTQUFpQjtRQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQyxDQUFDO0NBQ0oifQ==