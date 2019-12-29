import { Table } from "./table.js";
import { Xml } from "../utils/xml.js";
import { Metrics } from "../utils/metrics.js";
import { TableColumn } from "./table-column.js";
import { TableRow } from "./table-row.js";
import { TableStyle } from "./table-style.js";
import { TableCell } from "./table-cell.js";
import { ParagraphType } from "../paragraph/paragraph.js";
import { TableBorder, TableBorderType } from "./table-border.js";
import { Justification } from "../paragraph/par-style.js";
import { ParagraphReader } from "../paragraph/paragraph-reader.js";
import { TableBorderSet } from "./table-border-set.js";
import { TableMarginSet } from "./table-margin-set.js";
export class TableReader {
    static readTable(docx, tableNode) {
        const table = new Table(docx);
        tableNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "w:tr":
                    const row = this.readTableRow(child, table);
                    table.rows.push(row);
                    break;
                case "w:tblPr":
                    table.style = this.readTableStyle(child);
                    break;
                case "w:tblGrid":
                    let start = 0;
                    child.childNodes.forEach(col => {
                        if (col.nodeName === "w:gridCol") {
                            const w = Xml.getAttribute(col, "w:w");
                            if (w !== undefined) {
                                const width = Metrics.convertTwipsToPixels(parseInt(w));
                                table.columns.push(new TableColumn(start, width));
                                start += width;
                            }
                        }
                    });
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Table reading.`);
                    break;
            }
        });
        return table;
    }
    static readTableRow(rowNode, table) {
        const row = new TableRow(table);
        const rowStyle = new TableStyle();
        rowStyle.higherStyle = table.style;
        let colIndex = 0;
        rowNode.childNodes.forEach(cellNode => {
            if (cellNode.nodeName === "w:tc") {
                const cell = this.readTableCell(cellNode, table, rowStyle, colIndex);
                colIndex += cell.columns.length;
                row.cells.push(cell);
            }
        });
        return row;
    }
    static readTableCell(cellNode, table, rowStyle, colIndex) {
        let style = new TableStyle();
        const cell = new TableCell(table.columns, style, colIndex);
        cellNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "w:p":
                    const par = ParagraphReader.readParagraph(table.docx, child);
                    par.type = ParagraphType.TableCell;
                    cell.pars.push(par);
                    break;
                case "w:tcPr":
                    style = this.readTableCellPresentation(child, rowStyle);
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during TableCell reading.`);
                    break;
            }
        });
        const id = Xml.getAttribute(cellNode, "w:id");
        if (id !== undefined) {
            cell.id = id;
        }
        return cell;
    }
    static readTableCellPresentation(cellPrNode, rowStyle) {
        const style = new TableStyle();
        style.higherStyle = rowStyle;
        cellPrNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "w:tcW":
                    const w = Xml.getAttribute(child, "w:w");
                    if (w !== undefined) {
                        style.width = Metrics.convertTwipsToPixels(parseInt(w));
                    }
                    break;
                case "w:gridSpan":
                    const gridSpan = Xml.getStringValue(child);
                    if (gridSpan !== undefined) {
                        style.gridSpan = parseInt(gridSpan);
                    }
                    break;
                case "w:tcBorders":
                    style.borders = this.readBorders(child);
                    break;
                case "w:tcMar":
                    style.margins = this.readCellMargins(child);
                    break;
                case "w:shd":
                    const shading = Xml.getAttribute(child, "fill");
                    if (shading !== undefined) {
                        style.shading = shading;
                    }
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Table Cell Style reading.`);
                    break;
            }
        });
        return style;
    }
    static readBorders(bordersNode) {
        const borders = new TableBorderSet();
        bordersNode.childNodes.forEach(node => {
            const name = node.nodeName;
            switch (name) {
                case "w:left":
                    if (borders.borderStart === undefined) {
                        borders.borderStart = this.readTableBorder(node);
                    }
                    break;
                case "w:start":
                    borders.borderStart = this.readTableBorder(node);
                    break;
                case "w:right":
                    if (borders.borderEnd === undefined) {
                        borders.borderEnd = this.readTableBorder(node);
                    }
                    break;
                case "w:end":
                    borders.borderEnd = this.readTableBorder(node);
                    break;
                case "w:top":
                    borders.borderTop = this.readTableBorder(node);
                    break;
                case "w:bottom":
                    borders.borderBottom = this.readTableBorder(node);
                    break;
                case "w:insideH":
                    borders.borderHorizontal = this.readTableBorder(node);
                    break;
                case "w:insideV":
                    borders.borderVertical = this.readTableBorder(node);
                    break;
                default:
                    console.log(`Don't know how to parse ${node.nodeName} during Table Borders reading.`);
                    break;
            }
        });
        return borders;
    }
    static readCellMargins(cellMarginNode) {
        const margins = new TableMarginSet();
        cellMarginNode.childNodes.forEach(node => {
            const name = node.nodeName;
            switch (name) {
                case "w:left":
                    const left = Xml.getAttribute(node, "w:w");
                    if (left !== undefined) {
                        margins.cellMarginStart = Metrics.convertTwipsToPixels(parseInt(left));
                    }
                    break;
                case "w:start":
                    const start = Xml.getAttribute(node, "w:w");
                    if (start !== undefined) {
                        margins.cellMarginStart = Metrics.convertTwipsToPixels(parseInt(start));
                    }
                    break;
                case "w:right":
                    const right = Xml.getAttribute(node, "w:w");
                    if (right !== undefined) {
                        margins.cellMarginEnd = Metrics.convertTwipsToPixels(parseInt(right));
                    }
                    break;
                case "w:end":
                    const end = Xml.getAttribute(node, "w:w");
                    if (end !== undefined) {
                        margins.cellMarginEnd = Metrics.convertTwipsToPixels(parseInt(end));
                    }
                    break;
                case "w:top":
                    const top = Xml.getAttribute(node, "w:w");
                    if (top !== undefined) {
                        margins.cellMarginTop = Metrics.convertTwipsToPixels(parseInt(top));
                    }
                    break;
                case "w:bottom":
                    const bottom = Xml.getAttribute(node, "w:w");
                    if (bottom !== undefined) {
                        margins.cellMarginBottom = Metrics.convertTwipsToPixels(parseInt(bottom));
                    }
                    break;
                default:
                    console.log(`Don't know how to parse ${node.nodeName} during Table Cell Margins reading.`);
                    break;
            }
        });
        return margins;
    }
    static readTableBorder(borderNode) {
        // TODO: Handle frame, shadow
        const border = new TableBorder();
        const val = Xml.getAttribute(borderNode, "w:val");
        if (val !== undefined) {
            border.type = TableBorderType[val];
        }
        const sz = Xml.getAttribute(borderNode, "w:sz");
        if (sz !== undefined) {
            // Border size is in quarter points.
            border.size = Metrics.convertPointToPixels(parseInt(sz, 10) / 4);
        }
        const space = Xml.getAttribute(borderNode, "w:space");
        if (space !== undefined) {
            border.spacing = Metrics.convertTwipsToPixels(parseInt(space, 10));
        }
        const color = Xml.getAttribute(borderNode, "w:color");
        if (color !== undefined) {
            border.color = color;
        }
        return border;
    }
    static readTableStyle(tblPrNode) {
        const style = new TableStyle();
        tblPrNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "w:tblBorders":
                    style.borders = this.readBorders(child);
                    break;
                case "w:tblCellMar":
                    style.margins = this.readCellMargins(child);
                    break;
                case "w:jc":
                    const justification = Xml.getStringValue(child);
                    if (justification !== undefined) {
                        style.justification = Justification[justification];
                    }
                    break;
                case "w:tblInd":
                    const w = Xml.getAttribute(child, "w:w");
                    if (w !== undefined) {
                        style.identation = Metrics.convertTwipsToPixels(parseInt(w, 10));
                    }
                    break;
                case "w:cellSpacing":
                    const spacing = Xml.getAttribute(child, "w:w");
                    if (spacing !== undefined) {
                        style.cellSpacing = Metrics.convertTwipsToPixels(parseInt(spacing, 10));
                    }
                    break;
                case "w:tblW":
                    // Ignore
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Table Style reading.`);
                    break;
            }
        });
        return style;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtcmVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3RhYmxlL3RhYmxlLXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbkUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUV2RCxNQUFNLE9BQU8sV0FBVztJQUNiLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBZSxFQUFFLFNBQW9CO1FBQ3pELE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pDLFFBQU8sS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDbkIsS0FBSyxN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