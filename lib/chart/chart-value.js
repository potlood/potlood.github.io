export class ChartValue {
    constructor() {
        this.numeric = undefined;
        this.text = undefined;
    }
    toString() {
        let str = "";
        if (this.numeric !== undefined) {
            str = this.numeric.toString();
        }
        else if (this.text !== undefined) {
            str = this.text;
        }
        return str;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtdmFsdWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2hhcnQvY2hhcnQtdmFsdWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsTUFBTSxPQUFPLFVBQVU7SUFBdkI7UUFDVyxZQUFPLEdBQXVCLFNBQVMsQ0FBQztRQUN4QyxTQUFJLEdBQXVCLFNBQVMsQ0FBQztJQVdoRCxDQUFDO0lBVFUsUUFBUTtRQUNYLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDNUIsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakM7YUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQ2hDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ25CO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0NBQ0oifQ==