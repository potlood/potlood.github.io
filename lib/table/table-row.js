import { InSequence } from "../utils/in-sequence.js";
export class TableRow {
    constructor(table) {
        this.cells = [];
        this.table = table;
    }
    getPars() {
        const pars = [];
        this.cells.forEach(cell => {
            pars.push(...cell.pars);
        });
        return pars;
    }
    performLayout(flow) {
        const startY = flow.getY();
        let maxY = 0;
        this.cells.forEach(cell => {
            const cellFlow = cell.getCellFlow(flow);
            cell.performLayout(cellFlow);
            if (cell.style.rowSpanOrder === InSequence.Only) {
                const cellY = cellFlow.getMaxY();
                maxY = Math.max(cellY, maxY);
            }
        });
        const maxHeight = maxY - startY;
        // Set the max height as height for all cells.
        this.cells.forEach(cell => {
            if (cell.style.rowSpanOrder === InSequence.Only) {
                cell.bounds.height = maxHeight;
            }
        });
        this.maxHeight = maxHeight;
        flow.advancePosition(maxHeight);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtcm93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3RhYmxlL3RhYmxlLXJvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFckQsTUFBTSxPQUFPLFFBQVE7SUFLakIsWUFBWSxLQUFZO1FBSGpCLFVBQUssR0FBZ0IsRUFBRSxDQUFDO1FBSTNCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxPQUFPO1FBQ1YsTUFBTSxJQUFJLEdBQWdCLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLGFBQWEsQ0FBQyxJQUFpQjtRQUNsQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEtBQUssVUFBVSxDQUFDLElBQUksRUFBRTtnQkFDN0MsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNqQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDaEM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxNQUFNLENBQUM7UUFDaEMsOENBQThDO1FBQzlDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3RCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEtBQUssVUFBVSxDQUFDLElBQUksRUFBRTtnQkFDN0MsSUFBSSxDQUFDLE1BQU8sQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO2FBQ25DO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7Q0FDSiJ9