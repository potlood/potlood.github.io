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
            this._painter.paintLine(bounds.left, bounds.y, bounds.right, bounds.y, cell.style.shading, bounds.height);
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
                this._painter.paintLine(bounds.left, bounds.top, bounds.right, bounds.top, outerBorders.borderTop.color, outerBorders.borderTop.size);
            }
            if (outerBorders.borderBottom !== undefined) {
                this._painter.paintLine(bounds.left, bounds.bottom, bounds.right, bounds.bottom, outerBorders.borderBottom.color, outerBorders.borderBottom.size);
            }
            if (outerBorders.borderStart !== undefined) {
                this._painter.paintLine(bounds.x, bounds.top, bounds.x, bounds.bottom, outerBorders.borderStart.color, outerBorders.borderStart.size);
            }
            if (outerBorders.borderEnd !== undefined) {
                this._painter.paintLine(bounds.right, bounds.top, bounds.right, bounds.bottom, outerBorders.borderEnd.color, outerBorders.borderEnd.size);
            }
        }
        if (innerBorders !== undefined) {
            bounds.subtractSpacing(style.cellSpacing);
            if (innerBorders.borderTop !== undefined) {
                this._painter.paintLine(bounds.left, bounds.top, bounds.right, bounds.top, innerBorders.borderTop.color, innerBorders.borderTop.size);
            }
            if (innerBorders.borderBottom !== undefined) {
                this._painter.paintLine(bounds.left, bounds.bottom, bounds.right, bounds.bottom, innerBorders.borderBottom.color, innerBorders.borderBottom.size);
            }
            if (innerBorders.borderStart !== undefined) {
                this._painter.paintLine(bounds.x, bounds.top, bounds.x, bounds.bottom, innerBorders.borderStart.color, innerBorders.borderStart.size);
            }
            if (innerBorders.borderEnd !== undefined) {
                this._painter.paintLine(bounds.right, bounds.top, bounds.right, bounds.bottom, innerBorders.borderEnd.color, innerBorders.borderEnd.size);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtcmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGFibGUvdGFibGUtcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsTUFBTSxPQUFPLGFBQWE7SUFJdEIsWUFBWSxPQUFpQixFQUFFLGlCQUFvQztRQUMvRCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLGlCQUFpQixDQUFDO0lBQzFDLENBQUM7SUFFTSxXQUFXLENBQUMsS0FBWTtRQUMzQixLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNyQixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDckIsSUFBSSxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsRUFBRTtvQkFDeEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM3QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7d0JBQ3BCLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUMzQyxDQUFDLENBQUMsQ0FBQztpQkFDTjtZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8saUJBQWlCLENBQUMsSUFBZTtRQUNyQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssRUFBRSxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDN0c7SUFDTCxDQUFDO0lBRU8sZ0JBQWdCLENBQUMsSUFBZSxFQUFFLEtBQWlCO1FBQ3ZELElBQUksWUFBWSxHQUErQixLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzdELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3hDLDJCQUEyQjtRQUMzQixJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUU7WUFDekQsK0NBQStDO1lBQy9DLFlBQVksR0FBRyxTQUFTLENBQUM7U0FDNUI7UUFDRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3pCLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUN0QixPQUFPO1NBQ1Y7UUFDRCxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUU7WUFDNUIsSUFBSSxZQUFZLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3pJO1lBQ0QsSUFBSSxZQUFZLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtnQkFDekMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JKO1lBQ0QsSUFBSSxZQUFZLENBQUMsV0FBVyxLQUFLLFNBQVMsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3pJO1lBQ0QsSUFBSSxZQUFZLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzdJO1NBQ0o7UUFDRCxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUU7WUFDNUIsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDMUMsSUFBSSxZQUFZLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3pJO1lBQ0QsSUFBSSxZQUFZLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtnQkFDekMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JKO1lBQ0QsSUFBSSxZQUFZLENBQUMsV0FBVyxLQUFLLFNBQVMsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3pJO1lBQ0QsSUFBSSxZQUFZLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzdJO1NBQ0o7SUFDTCxDQUFDO0NBRUoifQ==