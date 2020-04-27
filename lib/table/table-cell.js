import { VirtualFlow } from "../utils/virtual-flow.js";
import { Box } from "../utils/geometry/box.js";
import { InSequence } from "../utils/in-sequence.js";
export class TableCell {
    constructor(columns, style, startColumnIndex) {
        this.id = undefined;
        this.pars = [];
        this.numRowsInSpan = 1;
        this._columns = undefined;
        this.style = style;
        this._allColumns = columns;
        this._startColumnIndex = startColumnIndex;
    }
    performLayout(flow) {
        const x = flow.getX() + this._getColumns()[0].start;
        const y = flow.getY();
        const margins = this.style.margins;
        const borders = this.style.borders;
        this.bounds = new Box(x, y, this._getWidth(), 0);
        const rowOrder = (this.rowOrder === undefined) ? InSequence.Only : this.rowOrder;
        const columnOrder = this._getColumnOrder();
        this._contentBounds = this.bounds.clone().subtractBordersAndMargins(borders, margins, rowOrder, columnOrder);
        const contentHeight = this._performInnerLayout(flow, this._contentBounds);
        this._contentBounds.height = contentHeight;
        this.bounds = this._contentBounds.addBordersAndMargins(borders, margins, rowOrder, columnOrder);
    }
    get numColumns() {
        return this._getColumns().length;
    }
    _getColumns() {
        if (this._columns === undefined) {
            const columnSpan = this.style.columnSpan;
            this._columns = this._allColumns.slice(this._startColumnIndex, this._startColumnIndex + columnSpan);
        }
        return this._columns;
    }
    _getWidth() {
        let width = 0;
        this._getColumns().forEach(col => {
            width += col.width;
        });
        return width;
    }
    _performInnerLayout(flow, bounds) {
        const cellFlow = new VirtualFlow(bounds.left, bounds.right, bounds.top);
        this.pars.forEach(par => {
            par.performLayout(cellFlow);
        });
        flow.copyObstaclesFrom(cellFlow);
        return cellFlow.getMaxY(false) - bounds.top;
    }
    _getColumnOrder() {
        let order = InSequence.Middle;
        const numAllColumns = this._allColumns.length;
        if (numAllColumns === 1) {
            order = InSequence.Only;
        }
        else if (this._startColumnIndex === 0) {
            order = InSequence.First;
        }
        else if (this._startColumnIndex + this.numColumns === numAllColumns) {
            order = InSequence.Last;
        }
        return order;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtY2VsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90YWJsZS90YWJsZS1jZWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRXJELE1BQU0sT0FBTyxTQUFTO0lBWWxCLFlBQVksT0FBc0IsRUFBRSxLQUFpQixFQUFFLGdCQUF3QjtRQVh4RSxPQUFFLEdBQXVCLFNBQVMsQ0FBQztRQUNuQyxTQUFJLEdBQWdCLEVBQUUsQ0FBQztRQUd2QixrQkFBYSxHQUFXLENBQUMsQ0FBQztRQUl6QixhQUFRLEdBQThCLFNBQVMsQ0FBQztRQUlwRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztRQUMzQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUM7SUFDOUMsQ0FBQztJQUVNLGFBQWEsQ0FBQyxJQUFpQjtRQUNsQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNwRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDbkMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENB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