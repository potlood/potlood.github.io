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
        let rowOrder = InSequence.First;
        tableNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "w:tr":
                    const row = this.readTableRow(child, table);
                    row.setOrder(rowOrder);
                    table.rows.push(row);
                    rowOrder = InSequence.Middle;
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
        if (table.rows.length === 1) {
            table.rows[0].setOrder(InSequence.Only);
        }
        else {
            table.rows[table.rows.length - 1].setOrder(InSequence.Last);
        }
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
                colIndex += cell.numColumns;
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
                    cellStyle.rowSpanOrder = rowSpan;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtcmVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3RhYmxlL3RhYmxlLXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbkUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFckQsTUFBTSxPQUFPLFdBQVc7SUFDYixNQUFNLENBQUMsU0FBUyxDQUFDLElBQWUsRUFBRSxTQUFvQjtRQUN6RCxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQ2hDLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pDLFFBQU8sS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDbkIsS0FBSyxNQUFNO29CQUNQLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUM1QyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUN2QixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDckIsUUFBUSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7b0JBQzdCLE1BQU07Z0JBQ1YsS0FBSyxTQUFTO29CQUNWLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekMsTUFBTTtnQkFDVixLQUFLLFdBQVc7b0JBQ1osSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUNkLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUMzQixJQUFJLEdBQUcsQ0FBQyxRQUFRLEtBQUssV0FBVyxFQUFFOzRCQUM5QixNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQzs0QkFDdkMsSUFBSSxDQUFDLEtBQUssU0FBUyxFQUFFO2dDQUNqQixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ3hELEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksV0FBVyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dDQUNsRCxLQUFLLElBQUksS0FBSyxDQUFDOzZCQUNsQjt5QkFDSjtvQkFDTCxDQUFDLENBQUMsQ0FBQztvQkFDSCxNQUFNO2dCQUNWO29CQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEtBQUssQ0FBQyxRQUFRLHdCQUF3QixDQUFDLENBQUM7b0JBQy9FLE1BQU07YUFDYjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDekIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzNDO2FBQU07WUFDSCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDL0Q7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU8sTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFrQixFQUFFLEtBQVk7UUFDeEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUNsQyxRQUFRLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDbkMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ2xDLElBQUksUUFBUSxDQUFDLFFBQVEsS0FBSyxNQUFNLEVBQUU7Z0JBQzlCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3JFLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUM1QixHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN4QjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRU8sTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFtQixFQUFFLEtBQVksRUFBRSxRQUFvQixFQUFFLFFBQWdCO1FBQ2xHLE1BQU0sS0FBSyxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFDL0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDM0QsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDaEMsUUFBTyxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNuQixLQUFLLEtBQUs7b0JBQ04sTUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUM3RCxHQUFHLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUM7b0JBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNwQixNQUFNO2dCQUNWLEtBQUssUUFBUTtvQkFDVCxJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDdkQsTUFBTTtnQkFDVjtvQkFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixLQUFLLENBQUMsUUFBUSw0QkFBNEIsQ0FBQyxDQUFDO29CQUNuRixNQUFNO2FBQ2I7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLElBQUksRUFBRSxLQUFLLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztTQUNoQjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxNQUFNLENBQUMseUJBQXlCLENBQUMsVUFBcUIsRUFBRSxRQUFvQixFQUFFLFNBQXFCO1FBQ3ZHLFNBQVMsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDO1FBQ2pDLFVBQVUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2xDLFFBQVEsS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDcEIsS0FBSyxPQUFPO29CQUNSLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUN6QyxJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7d0JBQ2pCLFNBQVMsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMvRDtvQkFDRCxNQUFNO2dCQUNWLEtBQUssWUFBWTtvQkFDYixNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM3QyxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7d0JBQzFCLFNBQVMsQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO3FCQUMvQztvQkFDRCxNQUFNO2dCQUNWLEtBQUssYUFBYTtvQkFDZCxTQUFTLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzVDLE1BQU07Z0JBQ1YsS0FBSyxTQUFTO29CQUNWLFNBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDaEQsTUFBTTtnQkFDVixLQUFLLE9BQU87b0JBQ1IsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQ2xELElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTt3QkFDdkIsU0FBUyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7cUJBQy9CO29CQUNELE1BQU07Z0JBQ1YsS0FBSyxVQUFVO29CQUNYLElBQUksT0FBTyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7b0JBQ2hDLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pDLElBQUksTUFBTSxLQUFLLFNBQVMsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO3dCQUM5QyxPQUFPLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQztxQkFDOUI7b0JBQ0QsU0FBUyxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUM7b0JBQ2pDLE1BQU07Z0JBQ1YsS0FBSyxVQUFVO29CQUNYLG1CQUFtQjtvQkFDbkIsTUFBTTtnQkFDVjtvQkFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixLQUFLLENBQUMsUUFBUSxtQ0FBbUMsQ0FBQyxDQUFDO29CQUMxRixNQUFNO2FBQ2I7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxNQUFNLENBQUMsV0FBVyxDQUFDLFdBQXNCO1FBQzdDLE1BQU0sT0FBTyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDckMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUMzQixRQUFRLElBQUksRUFBRTtnQkFDVixLQUFLLFFBQVEsQ0FBQztnQkFDZCxLQUFLLFNBQVM7b0JBQ1YsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNqRCxNQUFNO2dCQUNWLEtBQUssU0FBUyxDQUFDO2dCQUNmLEtBQUssT0FBTztvQkFDUixPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQy9DLE1BQU07Z0JBQ1YsS0FBSyxPQUFPO29CQUNSLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDL0MsTUFBTTtnQkFDVixLQUFLLFVBQVU7b0JBQ1gsT0FBTyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNsRCxNQUFNO2dCQUNWLEtBQUssV0FBVztvQkFDWixPQUFPLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDdEQsTUFBTTtnQkFDVixLQUFLLFdBQVc7b0JBQ1osT0FBTyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwRCxNQUFNO2dCQUNWO29CQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLElBQUksQ0FBQyxRQUFRLGdDQUFnQyxDQUFDLENBQUM7b0JBQ3RGLE1BQU07YUFDYjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVPLE1BQU0sQ0FBQyxlQUFlLENBQUMsY0FBeUI7UUFDcEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUNyQyxjQUFjLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQzNCLFFBQVEsSUFBSSxFQUFFO2dCQUNWLEtBQUssUUFBUTtvQkFDVCxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDM0MsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO3dCQUNwQixPQUFPLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDMUU7b0JBQ0QsTUFBTTtnQkFDVixLQUFLLFNBQVM7b0JBQ1YsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzVDLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTt3QkFDckIsT0FBTyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7cUJBQzNFO29CQUNELE1BQU07Z0JBQ1YsS0FBSyxTQUFTO29CQUNWLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUM1QyxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7d0JBQ3JCLE9BQU8sQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3FCQUN6RTtvQkFDRCxNQUFNO2dCQUNWLEtBQUssT0FBTztvQkFDUixNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO3dCQUNuQixPQUFPLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztxQkFDdkU7b0JBQ0QsTUFBTTtnQkFDVixLQUFLLE9BQU87b0JBQ1IsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzFDLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTt3QkFDbkIsT0FBTyxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZFO29CQUNELE1BQU07Z0JBQ1YsS0FBSyxVQUFVO29CQUNYLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUM3QyxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7d0JBQ3RCLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7cUJBQzdFO29CQUNELE1BQU07Z0JBQ1Y7b0JBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsSUFBSSxDQUFDLFFBQVEscUNBQXFDLENBQUMsQ0FBQztvQkFDM0YsTUFBTTthQUNiO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRU8sTUFBTSxDQUFDLGVBQWUsQ0FBQyxVQUFxQjtRQUNoRCw2QkFBNkI7UUFDN0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUNqQyxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRCxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFDbkIsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDaEQ7UUFDRCxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoRCxJQUFJLEVBQUUsS0FBSyxTQUFTLEVBQUU7WUFDbEIsb0NBQW9DO1lBQ3BDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDcEU7UUFDRCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN0RCxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDckIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3RFO1FBQ0QsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdEQsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3JCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQ3hCO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVPLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFhO1FBQzdDLElBQUksVUFBVSxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUM7UUFDdEMsUUFBTyxLQUFLLEVBQUU7WUFDVixLQUFLLFFBQVE7Z0JBQ1QsVUFBVSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUM7Z0JBQ3BDLE1BQU07WUFDVixLQUFLLGdCQUFnQjtnQkFDakIsVUFBVSxHQUFHLGVBQWUsQ0FBQyxjQUFjLENBQUM7Z0JBQzVDLE1BQU07WUFDVixLQUFLLFFBQVE7Z0JBQ1QsVUFBVSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUM7Z0JBQ3BDLE1BQU07WUFDVixLQUFLLGNBQWM7Z0JBQ2YsVUFBVSxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUM7Z0JBQzFDLE1BQU07WUFDVixLQUFLLFNBQVM7Z0JBQ1YsVUFBVSxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUM7Z0JBQ3JDLE1BQU07WUFDVixLQUFLLFlBQVk7Z0JBQ2IsVUFBVSxHQUFHLGVBQWUsQ0FBQyxVQUFVLENBQUM7Z0JBQ3hDLE1BQU07WUFDVixLQUFLLFFBQVE7Z0JBQ1QsVUFBVSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUM7Z0JBQ3BDLE1BQU07WUFDVixLQUFLLFFBQVE7Z0JBQ1QsVUFBVSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUM7Z0JBQ3BDLE1BQU07WUFDVixLQUFLLFlBQVk7Z0JBQ2IsVUFBVSxHQUFHLGVBQWUsQ0FBQyxVQUFVLENBQUM7Z0JBQ3hDLE1BQU07WUFDVixLQUFLLE9BQU87Z0JBQ1IsVUFBVSxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUM7Z0JBQ25DLE1BQU07WUFDVixLQUFLLFFBQVE7Z0JBQ1QsVUFBVSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUM7Z0JBQ3BDLE1BQU07WUFDVixLQUFLLE9BQU87Z0JBQ1IsVUFBVSxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUM7Z0JBQ25DLE1BQU07WUFDVixLQUFLLG1CQUFtQjtnQkFDcEIsVUFBVSxHQUFHLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQztnQkFDL0MsTUFBTTtZQUNWLEtBQUssb0JBQW9CO2dCQUNyQixVQUFVLEdBQUcsZUFBZSxDQUFDLGtCQUFrQixDQUFDO2dCQUNoRCxNQUFNO1lBQ1YsS0FBSyxtQkFBbUI7Z0JBQ3BCLFVBQVUsR0FBRyxlQUFlLENBQUMsaUJBQWlCLENBQUM7Z0JBQy9DLE1BQU07WUFDVixLQUFLLG1CQUFtQjtnQkFDcEIsVUFBVSxHQUFHLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQztnQkFDL0MsTUFBTTtZQUNWLEtBQUssb0JBQW9CO2dCQUNyQixVQUFVLEdBQUcsZUFBZSxDQUFDLGtCQUFrQixDQUFDO2dCQUNoRCxNQUFNO1lBQ1YsS0FBSyxtQkFBbUI7Z0JBQ3BCLFVBQVUsR0FBRyxlQUFlLENBQUMsaUJBQWlCLENBQUM7Z0JBQy9DLE1BQU07WUFDVixLQUFLLHVCQUF1QjtnQkFDeEIsVUFBVSxHQUFHLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQztnQkFDbkQsTUFBTTtZQUNWLEtBQUssd0JBQXdCO2dCQUN6QixVQUFVLEdBQUcsZUFBZSxDQUFDLHNCQUFzQixDQUFDO2dCQUNwRCxNQUFNO1lBQ1YsS0FBSyx1QkFBdUI7Z0JBQ3hCLFVBQVUsR0FBRyxlQUFlLENBQUMscUJBQXFCLENBQUM7Z0JBQ25ELE1BQU07WUFDVixLQUFLLGNBQWM7Z0JBQ2YsVUFBVSxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUM7Z0JBQ3RDLE1BQU07WUFDVixLQUFLLGVBQWU7Z0JBQ2hCLFVBQVUsR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDO2dCQUN2QyxNQUFNO1lBQ1YsS0FBSyxRQUFRO2dCQUNULFVBQVUsR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDO2dCQUNwQyxNQUFNO1lBQ1YsS0FBSyxNQUFNO2dCQUNQLFVBQVUsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDO2dCQUNsQyxNQUFNO1lBQ1YsS0FBSyxNQUFNLENBQUM7WUFDWixLQUFLLEtBQUssQ0FBQztZQUNYO2dCQUNJLFVBQVUsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDO2dCQUNsQyxNQUFNO1NBQ2I7UUFDRCxPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDO0lBRU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFvQjtRQUM5QyxNQUFNLEtBQUssR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQy9CLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pDLFFBQVEsS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDcEIsS0FBSyxjQUFjO29CQUNmLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDeEMsTUFBTTtnQkFDVixLQUFLLGNBQWM7b0JBQ2YsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM1QyxNQUFNO2dCQUNWLEtBQUssTUFBTTtvQkFDUCxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNoRCxJQUFJLGFBQWEsS0FBSyxTQUFTLEVBQUU7d0JBQzdCLEtBQUssQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDLGFBQTJDLENBQUMsQ0FBQztxQkFDcEY7b0JBQ0QsTUFBTTtnQkFDVixLQUFLLFVBQVU7b0JBQ1gsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ3pDLElBQUksQ0FBQyxLQUFLLFNBQVMsRUFBRTt3QkFDakIsS0FBSyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUNwRTtvQkFDRCxNQUFNO2dCQUNWLEtBQUssZUFBZTtvQkFDaEIsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQy9DLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTt3QkFDdkIsS0FBSyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUMzRTtvQkFDRCxNQUFNO2dCQUNWLEtBQUssUUFBUSxDQUFDO2dCQUNkLEtBQUssWUFBWSxDQUFDO2dCQUNsQixLQUFLLFdBQVc7b0JBQ1osU0FBUztvQkFDVCxNQUFNO2dCQUNWO29CQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEtBQUssQ0FBQyxRQUFRLDhCQUE4QixDQUFDLENBQUM7b0JBQ3JGLE1BQU07YUFDYjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztDQUNKIn0=