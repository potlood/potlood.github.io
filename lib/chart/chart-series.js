export class ChartSeries {
    constructor() {
        this.categories = [];
        this.values = [];
        this.color = "";
        this.name = "";
    }
    get hasNumericValues() {
        return this.values.length > 0 && this.values[0].numeric !== undefined;
    }
    get hasNumericCategories() {
        return this.categories.length > 0 && this.categories[0].numeric !== undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtc2VyaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYXJ0L2NoYXJ0LXNlcmllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLE9BQU8sV0FBVztJQUF4QjtRQUNXLGVBQVUsR0FBaUIsRUFBRSxDQUFDO1FBQzlCLFdBQU0sR0FBaUIsRUFBRSxDQUFDO1FBQzFCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDbkIsU0FBSSxHQUFXLEVBQUUsQ0FBQztJQVM3QixDQUFDO0lBUEcsSUFBVyxnQkFBZ0I7UUFDdkIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDO0lBQzFFLENBQUM7SUFFRCxJQUFXLG9CQUFvQjtRQUMzQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUM7SUFDbEYsQ0FBQztDQUNKIn0=