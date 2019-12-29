import { BaseChart } from "./base-chart.js";
export class PieChart extends BaseChart {
    constructor(space) {
        super(space);
        this.startAngle = 0;
    }
    getValueSum(seriesIndex) {
        const values = this.series[seriesIndex].values;
        let count = 0;
        for (let i = 0; i < values.length; i++) {
            const numeric = values[i].numeric;
            if (numeric !== undefined) {
                count += numeric;
            }
        }
        return count;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllLWNoYXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYXJ0L3BpZS1jaGFydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFNUMsTUFBTSxPQUFPLFFBQVMsU0FBUSxTQUFTO0lBR25DLFlBQVksS0FBaUI7UUFDekIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVNLFdBQVcsQ0FBQyxXQUFtQjtRQUNsQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUMvQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwQyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ2xDLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtnQkFDdkIsS0FBSyxJQUFJLE9BQU8sQ0FBQzthQUNwQjtTQUNKO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztDQUNKIn0=