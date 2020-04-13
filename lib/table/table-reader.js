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
import { InSequence } from "../utils/in-sequence.js";
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
        const style = new TableStyle();
        const cell = new TableCell(table.columns, style, colIndex);
        cellNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "w:p":
                    const par = ParagraphReader.readParagraph(table.docx, child);
                    par.type = ParagraphType.TableCell;
                    cell.pars.push(par);
                    break;
                case "w:tcPr":
                    this.readTableCellPresentation(child, rowStyle, style);
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
    static readTableCellPresentation(cellPrNode, rowStyle, cellStyle) {
        cellStyle.higherStyle = rowStyle;
        cellPrNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "w:tcW":
                    const w = Xml.getAttribute(child, "w:w");
                    if (w !== undefined) {
                        cellStyle.width = Metrics.convertTwipsToPixels(parseInt(w));
                    }
                    break;
                case "w:gridSpan":
                    const columnSpan = Xml.getStringValue(child);
                    if (columnSpan !== undefined) {
                        cellStyle.columnSpan = parseInt(columnSpan);
                    }
                    break;
                case "w:tcBorders":
                    cellStyle.borders = this.readBorders(child);
                    break;
                case "w:tcMar":
                    cellStyle.margins = this.readCellMargins(child);
                    break;
                case "w:shd":
                    const shading = Xml.getAttribute(child, "w:fill");
                    if (shading !== undefined) {
                        cellStyle.shading = shading;
                    }
                    break;
                case "w:vMerge":
                    let rowSpan = InSequence.Middle;
                    const vMerge = Xml.getStringValue(child);
                    if (vMerge !== undefined && vMerge === "restart") {
                        rowSpan = InSequence.First;
                    }
                    cellStyle.rowSpan = rowSpan;
                    break;
                case "w:vAlign":
                    // TODO: Implement.
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Table Cell Style reading.`);
                    break;
            }
        });
    }
    static readBorders(bordersNode) {
        const borders = new TableBorderSet();
        bordersNode.childNodes.forEach(node => {
            const name = node.nodeName;
            switch (name) {
                case "w:left":
                case "w:start":
                    borders.borderStart = this.readTableBorder(node);
                    break;
                case "w:right":
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
            border.type = this.parseTableBorderType(val);
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
    static parseTableBorderType(input) {
        let borderType = TableBorderType.None;
        switch (input) {
            case "single":
                borderType = TableBorderType.Single;
                break;
            case "dashDotStroked":
                borderType = TableBorderType.DashDotStroked;
                break;
            case "dashed":
                borderType = TableBorderType.Dashed;
                break;
            case "dashSmallGap":
                borderType = TableBorderType.DashSmallGap;
                break;
            case "dotDash":
                borderType = TableBorderType.DotDash;
                break;
            case "dotDotDash":
                borderType = TableBorderType.DotDotDash;
                break;
            case "dotted":
                borderType = TableBorderType.Dotted;
                break;
            case "double":
                borderType = TableBorderType.Double;
                break;
            case "doubleWave":
                borderType = TableBorderType.DoubleWave;
                break;
            case "inset":
                borderType = TableBorderType.Inset;
                break;
            case "outset":
                borderType = TableBorderType.Outset;
                break;
            case "thick":
                borderType = TableBorderType.Thick;
                break;
            case "thickThinLargeGap":
                borderType = TableBorderType.ThickThinLargeGap;
                break;
            case "thickThinMediumGap":
                borderType = TableBorderType.ThickThinMediumGap;
                break;
            case "thickThinSmallGap":
                borderType = TableBorderType.ThickThinSmallGap;
                break;
            case "thinThickLargeGap":
                borderType = TableBorderType.ThinThickLargeGap;
                break;
            case "thinThickMediumGap":
                borderType = TableBorderType.ThinThickMediumGap;
                break;
            case "thinThickSmallGap":
                borderType = TableBorderType.ThinThickSmallGap;
                break;
            case "thinThickThinLargeGap":
                borderType = TableBorderType.ThinThickThinLargeGap;
                break;
            case "thinThickThinMediumGap":
                borderType = TableBorderType.ThinThickThinMediumGap;
                break;
            case "thinThickThinSmallGap":
                borderType = TableBorderType.ThinThickThinSmallGap;
                break;
            case "threeDEmboss":
                borderType = TableBorderType.Emboss3D;
                break;
            case "threeDEngrave":
                borderType = TableBorderType.Engrave3D;
                break;
            case "triple":
                borderType = TableBorderType.Triple;
                break;
            case "wave":
                borderType = TableBorderType.Wave;
                break;
            case "none":
            case "nil":
            default:
                borderType = TableBorderType.None;
                break;
        }
        return borderType;
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
                case "w:tblStyle":
                case "w:tblLook":
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtcmVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3RhYmxlL3RhYmxlLXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbkUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFckQsTUFBTSxPQUFPLFdBQVc7SUFDYixNQUFNLENBQUMsU0FBUyxDQUFDLElBQWUsRUFBRSxTQUFvQjtRQUN6RCxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixTQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZ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