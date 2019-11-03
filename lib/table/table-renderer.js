export class TableRenderer {
    constructor(painter, paragraphRenderer) {
        this._painter = painter;
        this._parRenderer = paragraphRenderer;
    }
    renderTable(table, flow) {
        table.rows.forEach(row => {
            const height = row.getMaxHeight();
            row.cells.forEach(cell => {
                const cellFlow = flow.createCellFlow(cell, table);
                this.renderCellShading(cell, cellFlow, height);
                this.renderCellBorder(cell, table.style, cellFlow, height);
                let topPadding = table.style.margins.cellMarginTop;
                const topBorder = cell.style.borders.borderTop;
                if (topBorder !== undefined) {
                    topPadding += topBorder.size;
                }
                cellFlow.advancePosition(topPadding);
                cell.pars.forEach(par => {
                    this._parRenderer.renderParagraph(par, cellFlow);
                });
            });
            flow.advancePosition(height);
        });
    }
    renderCellShading(cell, flow, height) {
        if (cell.style.shading !== "") {
            let x = flow.getX();
            let y = flow.getY();
            let width = cell.getWidth();
            this._painter.paintLine(x, y, x + width, y, cell.style.shading, height);
        }
    }
    renderCellBorder(cell, style, flow, height) {
        let outerBorders = style.borders;
        const innerBorders = cell.style.borders;
        // Resolve border conflicts
        if (style.cellSpacing === 0 && cell.style.hasBordersDefined) {
            // Disable cell borders defined at table level.
            outerBorders = undefined;
        }
        let x = flow.getX();
        let y = flow.getY();
        let cellWidth = cell.getWidth();
        if (outerBorders !== undefined) {
            if (outerBorders.borderTop !== undefined) {
                this._painter.paintLine(x, y, x + cellWidth, y, outerBorders.borderTop.color, outerBorders.borderTop.size);
            }
            if (outerBorders.borderBottom !== undefined) {
                const bottom = y + height;
                this._painter.paintLine(x, bottom, x + cellWidth, bottom, outerBorders.borderBottom.color, outerBorders.borderBottom.size);
            }
            if (outerBorders.borderStart !== undefined) {
                this._painter.paintLine(x, y, x, y + height, outerBorders.borderStart.color, outerBorders.borderStart.size);
            }
            if (outerBorders.borderEnd !== undefined) {
                const end = x + cellWidth;
                this._painter.paintLine(end, y, end, y + height, outerBorders.borderEnd.color, outerBorders.borderEnd.size);
            }
        }
        if (innerBorders !== undefined) {
            const cellSpacing = style.cellSpacing;
            x += cellSpacing;
            y += cellSpacing;
            cellWidth -= 2 * cellSpacing;
            if (innerBorders.borderTop !== undefined) {
                this._painter.paintLine(x, y, x + cellWidth, y, innerBorders.borderTop.color, innerBorders.borderTop.size);
            }
            if (innerBorders.borderBottom !== undefined) {
                const bottom = y + height;
                this._painter.paintLine(x, bottom, x + cellWidth, bottom, innerBorders.borderBottom.color, innerBorders.borderBottom.size);
            }
            if (innerBorders.borderStart !== undefined) {
                this._painter.paintLine(x, y, x, y + height, innerBorders.borderStart.color, innerBorders.borderStart.size);
            }
            if (innerBorders.borderEnd !== undefined) {
                const end = x + cellWidth;
                this._painter.paintLine(end, y, end, y + height, innerBorders.borderEnd.color, innerBorders.borderEnd.size);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtcmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGFibGUvdGFibGUtcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsTUFBTSxPQUFPLGFBQWE7SUFJdEIsWUFBWSxPQUFpQixFQUFFLGlCQUFvQztRQUMvRCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLGlCQUFpQixDQUFDO0lBQzFDLENBQUM7SUFFTSxXQUFXLENBQUMsS0FBWSxFQUFFLElBQWlCO1FBQzlDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3JCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNsQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDckIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2xELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUMzRCxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7Z0JBQ25ELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztnQkFDL0MsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO29CQUN6QixVQUFVLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQztpQkFDaEM7Z0JBQ0QsUUFBUSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDckQsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8saUJBQWlCLENBQUMsSUFBZSxFQUFFLElBQWlCLEVBQUUsTUFBYztRQUN4RSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLEVBQUUsRUFBRTtZQUMzQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3BCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQzNFO0lBQ0wsQ0FBQztJQUVPLGdCQUFnQixDQUFDLElBQWUsRUFBRSxLQUFpQixFQUFFLElBQWlCLEVBQUUsTUFBYztRQUMxRixJQUFJLFlBQVksR0FBK0IsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3RCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUN4QywyQkFBMkI7UUFDM0IsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFO1lBQ3pELCtDQUErQztZQUMvQyxZQUFZLEdBQUcsU0FBUyxDQUFDO1NBQzVCO1FBQ0QsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwQixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEMsSUFBSSxZQUFZLEtBQUssU0FBUyxFQUFFO1lBQzVCLElBQUksWUFBWSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM5RztZQUNELElBQUksWUFBWSxDQUFDLFlBQVksS0FBSyxTQUFTLEVBQUU7Z0JBQ3pDLE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM5SDtZQUNELElBQUksWUFBWSxDQUFDLFdBQVcsS0FBSyxTQUFTLEVBQUU7Z0JBQ3hDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMvRztZQUNELElBQUksWUFBWSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7Z0JBQ3RDLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMvRztTQUNKO1FBQ0QsSUFBSSxZQUFZLEtBQUssU0FBUyxFQUFFO1lBQzVCLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7WUFDdEMsQ0FBQyxJQUFJLFdBQVcsQ0FBQztZQUNqQixDQUFDLElBQUksV0FBVyxDQUFDO1lBQ2pCLFNBQVMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDO1lBQzdCLElBQUksWUFBWSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM5RztZQUNELElBQUksWUFBWSxDQUFDLFlBQVksS0FBSyxTQUFTLEVBQUU7Z0JBQ3pDLE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM5SDtZQUNELElBQUksWUFBWSxDQUFDLFdBQVcsS0FBSyxTQUFTLEVBQUU7Z0JBQ3hDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMvRztZQUNELElBQUksWUFBWSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7Z0JBQ3RDLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMvRztTQUNKO0lBQ0wsQ0FBQztDQUVKIn0=