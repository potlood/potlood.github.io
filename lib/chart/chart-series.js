import { ChartStyle } from "./chart-style.js";
export class ChartSeries {
    constructor() {
        this.categories = [];
        this.values = [];
        this.style = new ChartStyle();
        this.name = "";
    }
    get hasNumericValues() {
        return this.values.length > 0 && this.values[0].numeric !== undefined;
    }
    get hasNumericCategories() {
        return this.categories.length > 0 && this.categories[0].numeric !== undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtc2VyaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYXJ0L2NoYXJ0LXNlcmllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFOUMsTUFBTSxPQUFPLFdBQVc7SUFBeEI7UUFDVyxlQUFVLEdBQWlCLEVBQUUsQ0FBQztRQUM5QixXQUFNLEdBQWlCLEVBQUUsQ0FBQztRQUMxQixVQUFLLEdBQWUsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUNyQyxTQUFJLEdBQVcsRUFBRSxDQUFDO0lBUzdCLENBQUM7SUFQRyxJQUFXLGdCQUFnQjtRQUN2QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUM7SUFDMUUsQ0FBQztJQUVELElBQVcsb0JBQW9CO1FBQzNCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQztJQUNsRixDQUFDO0NBQ0oifQ==