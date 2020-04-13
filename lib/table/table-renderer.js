import { DashMode } from "../painting/i-painter.js";
import { TableBorderType } from "./table-border.js";
export class TableRenderer {
    constructor(painter, paragraphRenderer) {
        this._painter = painter;
        this._parRenderer = paragraphRenderer;
    }
    renderTable(table) {
        table.rows.forEach(row => {
            row.cells.forEach(cell => {
                if (cell.numRowsInSpan > 0) {
                    this.renderCellShading(cell);
                    this.renderCellBorder(cell, table.style);
                    cell.pars.forEach(par => {
                        this._parRenderer.renderParagraph(par);
                    });
                }
            });
        });
    }
    renderCellShading(cell) {
        const bounds = cell.bounds;
        if (cell.style.shading !== "" && bounds !== undefined) {
            const y = bounds.y + (bounds.height / 2);
            this._painter.paintLine(bounds.left, y, bounds.right, y, cell.style.shading, bounds.height, DashMode.Solid);
        }
    }
    renderCellBorder(cell, style) {
        let outerBorders = style.borders;
        const innerBorders = cell.style.borders;
        // Resolve border conflicts
        if (style.cellSpacing === 0 && cell.style.hasBordersDefined) {
            // Disable cell borders defined at table level.
            outerBorders = undefined;
        }
        let bounds = cell.bounds;
        if (bounds === undefined) {
            return;
        }
        if (outerBorders !== undefined) {
            if (outerBorders.borderTop !== undefined) {
                this._renderBorderPart(outerBorders.borderTop, {
                    x1: bounds.left,
                    y1: bounds.top,
                    x2: bounds.right,
                    y2: bounds.top,
                    color: outerBorders.borderTop.color
                });
            }
            if (outerBorders.borderBottom !== undefined) {
                this._renderBorderPart(outerBorders.borderBottom, {
                    x1: bounds.right,
                    y1: bounds.bottom,
                    x2: bounds.left,
                    y2: bounds.bottom,
                    color: outerBorders.borderBottom.color
                });
            }
            if (outerBorders.borderStart !== undefined) {
                this._renderBorderPart(outerBorders.borderStart, {
                    x1: bounds.x,
                    y1: bounds.bottom,
                    x2: bounds.x,
                    y2: bounds.top,
                    color: outerBorders.borderStart.color
                });
            }
            if (outerBorders.borderEnd !== undefined) {
                this._renderBorderPart(outerBorders.borderEnd, {
                    x1: bounds.right,
                    y1: bounds.top,
                    x2: bounds.right,
                    y2: bounds.bottom,
                    color: outerBorders.borderEnd.color
                });
            }
        }
        if (innerBorders !== undefined) {
            bounds.subtractSpacing(style.cellSpacing);
            if (innerBorders.borderTop !== undefined) {
                this._renderBorderPart(innerBorders.borderTop, {
                    x1: bounds.left,
                    y1: bounds.top,
                    x2: bounds.right,
                    y2: bounds.top,
                    color: innerBorders.borderTop.color
                });
            }
            if (innerBorders.borderBottom !== undefined) {
                this._renderBorderPart(innerBorders.borderBottom, {
                    x1: bounds.right,
                    y1: bounds.bottom,
                    x2: bounds.left,
                    y2: bounds.bottom,
                    color: innerBorders.borderBottom.color
                });
            }
            if (innerBorders.borderStart !== undefined) {
                this._renderBorderPart(innerBorders.borderStart, {
                    x1: bounds.x,
                    y1: bounds.bottom,
                    x2: bounds.x,
                    y2: bounds.top,
                    color: innerBorders.borderStart.color
                });
            }
            if (innerBorders.borderEnd !== undefined) {
                this._renderBorderPart(innerBorders.borderEnd, {
                    x1: bounds.right,
                    y1: bounds.top,
                    x2: bounds.right,
                    y2: bounds.bottom,
                    color: innerBorders.borderEnd.color
                });
            }
        }
    }
    _renderBorderPart(border, line) {
        let relativeSize = border.size;
        switch (border.type) {
            case TableBorderType.None:
                break;
            case TableBorderType.Double:
                this._renderBorderSubLines(line, [{ pos: 0, width: border.size * 2, dashing: DashMode.Solid }]);
                break;
            case TableBorderType.Triple:
                this._renderBorderSubLines(line, [{ pos: 0, width: border.size * 3, dashing: DashMode.Solid }]);
                break;
            case TableBorderType.ThickThinLargeGap:
                relativeSize /= 12;
                this._renderBorderSubLines(line, [
                    { pos: 2.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid },
                    { pos: 10.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid }
                ]);
                break;
            case TableBorderType.ThickThinMediumGap:
                relativeSize /= 10;
                this._renderBorderSubLines(line, [
                    { pos: 2.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid },
                    { pos: 8.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid }
                ]);
                break;
            case TableBorderType.ThickThinSmallGap:
                relativeSize /= 8;
                this._renderBorderSubLines(line, [
                    { pos: 2.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid },
                    { pos: 6.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid }
                ]);
                break;
            case TableBorderType.ThinThickLargeGap:
                relativeSize /= 12;
                this._renderBorderSubLines(line, [
                    { pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid },
                    { pos: 8.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid }
                ]);
                break;
            case TableBorderType.ThinThickMediumGap:
                relativeSize /= 10;
                this._renderBorderSubLines(line, [
                    { pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid },
                    { pos: 6.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid }
                ]);
                break;
            case TableBorderType.ThinThickSmallGap:
                relativeSize /= 8;
                this._renderBorderSubLines(line, [
                    { pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid },
                    { pos: 4.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid }
                ]);
                break;
            case TableBorderType.ThinThickThinLargeGap:
                relativeSize /= 18;
                this._renderBorderSubLines(line, [
                    { pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid },
                    { pos: 8.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid },
                    { pos: 16.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid }
                ]);
                break;
            case TableBorderType.ThinThickThinMediumGap:
                relativeSize /= 14;
                this._renderBorderSubLines(line, [
                    { pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid },
                    { pos: 2.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid },
                    { pos: 12.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid }
                ]);
                break;
            case TableBorderType.ThinThickThinSmallGap:
                relativeSize /= 10;
                this._renderBorderSubLines(line, [
                    { pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid },
                    { pos: 4.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid },
                    { pos: 8.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid }
                ]);
                break;
            case TableBorderType.DashDotStroked:
                relativeSize /= 3;
                this._renderBorderSubLines(line, [
                    { pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Dashed },
                    { pos: 2.5 * relativeSize, width: relativeSize, dashing: DashMode.Dotted }
                ]);
                break;
            case TableBorderType.Dashed:
                this._renderBorderSubLines(line, [{ pos: 0, width: border.size, dashing: DashMode.Dashed }]);
                break;
            case TableBorderType.DashSmallGap:
                this._renderBorderSubLines(line, [{ pos: 0, width: border.size, dashing: DashMode.DashedSmallGap }]);
                break;
            case TableBorderType.DotDash:
                relativeSize /= 3;
                this._renderBorderSubLines(line, [
                    { pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Dotted },
                    { pos: 2.5 * relativeSize, width: relativeSize, dashing: DashMode.Dashed }
                ]);
                break;
            case TableBorderType.DotDotDash:
                relativeSize /= 5;
                this._renderBorderSubLines(line, [
                    { pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Dotted },
                    { pos: 2.5 * relativeSize, width: relativeSize, dashing: DashMode.Dotted },
                    { pos: 4.5 * relativeSize, width: relativeSize, dashing: DashMode.Dashed }
                ]);
                break;
            case TableBorderType.Dotted:
                this._renderBorderSubLines(line, [{ pos: 0, width: border.size, dashing: DashMode.Dotted }]);
                break;
            case TableBorderType.Single:
            default:
                this._renderBorderSubLines(line, [{ pos: 0, width: border.size, dashing: DashMode.Solid }]);
                break;
        }
    }
    _renderBorderSubLines(line, subLines) {
        const xDirection = (line.x1 === line.x2) ? ((line.y1 < line.y2) ? -1 : 1) : 0;
        const yDirection = (line.y1 === line.y2) ? ((line.x1 > line.x2) ? -1 : 1) : 0;
        subLines.forEach(sub => {
            this._painter.paintLine(line.x1 + xDirection * sub.pos, line.y1 + yDirection * sub.pos, line.x2 + xDirection * sub.pos, line.y2 + yDirection * sub.pos, line.color, sub.width, sub.dashing);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtcmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGFibGUvdGFibGUtcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsT0FBTyxFQUFZLFFBQVEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRzlELE9BQU8sRUFBRSxlQUFlLEVBQWUsTUFBTSxtQkFBbUIsQ0FBQztBQWdCakUsTUFBTSxPQUFPLGFBQWE7SUFJdEIsWUFBWSxPQUFpQixFQUFFLGlCQUFvQztRQUMvRCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLGlCQUFpQixDQUFDO0lBQzFDLENBQUM7SUFFTSxXQUFXLENBQUMsS0FBWTtRQUMzQixLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNyQixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDckIsSUFBSSxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsRUFBRTtvQkFDeEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM3QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7d0JBQ3BCLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUMzQyxDQUFDLENBQUMsQ0FBQztpQkFDTjtZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8saUJBQWlCLENBQUMsSUFBZTtRQUNyQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxP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