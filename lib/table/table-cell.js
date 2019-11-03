export class TableCell {
    constructor(columns, style, startIndex) {
        this.id = undefined;
        this.rowSpan = 1;
        this.pars = [];
        this.style = style;
        this.columns = this.getColumns(columns, startIndex);
    }
    getHeight() {
        const width = this.getTextWidth();
        let height = this.style.margins.cellMarginTop + this.style.margins.cellMarginBottom;
        const topBorder = this.style.borders.borderTop;
        if (topBorder !== undefined) {
            height += topBorder.size;
        }
        const bottomBorder = this.style.borders.borderBottom;
        if (bottomBorder !== undefined) {
            height += bottomBorder.size;
        }
        this.pars.forEach(par => {
            height += par.getHeight(width);
        });
        return height;
    }
    getStart() {
        return this.columns[0].start;
    }
    getWidth() {
        let width = 0;
        this.columns.forEach(col => {
            width += col.width;
        });
        return width;
    }
    getTextWidth() {
        return this.getWidth() - this.style.margins.cellMarginStart - this.style.margins.cellMarginEnd;
    }
    getColumns(columns, startIndex) {
        const colSpan = this.style.gridSpan;
        return columns.slice(startIndex, startIndex + colSpan);
    }
    performLayout(flow) {
        this.pars.forEach(par => {
            par.performLayout(flow);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtY2VsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90YWJsZS90YWJsZS1jZWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUtBLE1BQU0sT0FBTyxTQUFTO0lBT2xCLFlBQVksT0FBc0IsRUFBRSxLQUFpQixFQUFFLFVBQWtCO1FBTmxFLE9BQUUsR0FBdUIsU0FBUyxDQUFDO1FBRW5DLFlBQU8sR0FBVyxDQUFDLENBQUM7UUFDcEIsU0FBSSxHQUFnQixFQUFFLENBQUM7UUFJMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU0sU0FBUztRQUNaLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNsQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7UUFDcEYsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQy9DLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtZQUN6QixNQUFNLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQztTQUM1QjtRQUNELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUNyRCxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUU7WUFDNUIsTUFBTSxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUM7U0FDL0I7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNwQixNQUFNLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFTSxRQUFRO1FBQ1gsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNqQyxDQUFDO0lBRU0sUUFBUTtRQUNYLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZCLEtBQUssSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVNLFlBQVk7UUFDZixPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO0lBQ25HLENBQUM7SUFFTyxVQUFVLENBQUMsT0FBc0IsRUFBRSxVQUFrQjtRQUN6RCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUNwQyxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLFVBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRU0sYUFBYSxDQUFDLElBQWlCO1FBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3BCLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0NBRUoifQ==