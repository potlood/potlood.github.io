import { VirtualFlow } from "../utils/virtual-flow.js";
import { Box } from "../utils/geometry/box.js";
export class TableCell {
    constructor(columns, style, startIndex) {
        this.id = undefined;
        this.pars = [];
        this.numRowsInSpan = 1;
        this._columns = undefined;
        this.style = style;
        this._allColumns = columns;
        this._startColumnIndex = startIndex;
    }
    performLayout(flow) {
        const x = flow.getX();
        const y = flow.getY();
        const margins = this.style.margins;
        const borders = this.style.borders;
        flow.advancePosition(margins.cellMarginTop);
        const topBorder = borders.borderTop;
        if (topBorder !== undefined) {
            flow.advancePosition(topBorder.size);
        }
        flow.advanceX(margins.cellMarginStart, margins.cellMarginEnd);
        const startBorder = borders.borderStart;
        const endBorder = borders.borderEnd;
        // TODO: Handle horizontal border also
        if (startBorder !== undefined && endBorder !== undefined) {
            flow.advanceX(startBorder.size, endBorder.size);
        }
        this.pars.forEach(par => {
            par.performLayout(flow);
        });
        flow.advancePosition(margins.cellMarginBottom);
        const bottomBorder = borders.borderBottom;
        if (bottomBorder !== undefined) {
            flow.advancePosition(bottomBorder.size);
        }
        let height = flow.getY() - y;
        this.bounds = new Box(x, y, this._getWidth(), height);
    }
    getCellFlow(flow) {
        const x = flow.getX() + this.columns[0].start;
        return new VirtualFlow(x, x + this._getWidth(), flow.getY());
    }
    get columns() {
        if (this._columns === undefined) {
            const columnSpan = this.style.columnSpan;
            this._columns = this._allColumns.slice(this._startColumnIndex, this._startColumnIndex + columnSpan);
        }
        return this._columns;
    }
    _getWidth() {
        let width = 0;
        this.columns.forEach(col => {
            width += col.width;
        });
        return width;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtY2VsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90YWJsZS90YWJsZS1jZWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFL0MsTUFBTSxPQUFPLFNBQVM7SUFVbEIsWUFBWSxPQUFzQixFQUFFLEtBQWlCLEVBQUUsVUFBa0I7UUFUbEUsT0FBRSxHQUF1QixTQUFTLENBQUM7UUFDbkMsU0FBSSxHQUFnQixFQUFFLENBQUM7UUFHdkIsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFHekIsYUFBUSxHQUE4QixTQUFTLENBQUM7UUFHcEQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7UUFDM0IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFVBQVUsQ0FBQztJQUN4QyxDQUFDO0lBRU0sYUFBYSxDQUFDLElBQWlCO1FBQ2xDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0QixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDbkMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDbkMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDNUMsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUNwQyxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDekIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEM7UUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzlELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFDeEMsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUNwQyxzQ0FBc0M7UUFDdEMsSUFBSSxXQUFXLEtBQUssU0FBUyxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDdEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNuRDtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3BCLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFDMUMsSUFBSSxZQUFZLEtBQUssU0FBUyxFQUFFO1lBQzVCLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzNDO1FBQ0QsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFTSxXQUFXLENBQUMsSUFBaUI7UUFDaEMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzlDLE9BQU8sSUFBSSxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELElBQVcsT0FBTztRQUNkLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7WUFDN0IsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7WUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxDQUFDO1NBQ3ZHO1FBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFTyxTQUFTO1FBQ2IsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdkIsS0FBSyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0NBQ0oifQ==