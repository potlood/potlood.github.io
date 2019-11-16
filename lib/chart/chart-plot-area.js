import { ChartStyle } from "./chart-style.js";
import { Rectangle } from "../utils/rectangle.js";
export class ChartPlotArea {
    constructor(space) {
        this.style = new ChartStyle();
        this.bounds = new Rectangle(0, 0, 0, 0);
        this.space = space;
    }
    determineRange() {
        if (this.valueAxis !== undefined && this.space.chart.series[0].hasNumericValues) {
            const valueRange = this.space.chart.getValueRange();
            valueRange.max = Math.ceil(1.2 * valueRange.max);
            this.space.chart.setValueRange(valueRange.min, valueRange.max);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtcGxvdC1hcmVhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYXJ0L2NoYXJ0LXBsb3QtYXJlYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBR2xELE1BQU0sT0FBTyxhQUFhO0lBT3RCLFlBQVksS0FBaUI7UUFMdEIsVUFBSyxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFHekIsV0FBTSxHQUFjLElBQUksU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBR2pELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxjQUFjO1FBQ2pCLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFO1lBQzdFLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3BELFVBQVUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsRTtJQUNMLENBQUM7Q0FDSiJ9