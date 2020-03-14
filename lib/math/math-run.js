export class MathRun {
    constructor(equation) {
        this._size = undefined;
        this.equation = equation;
    }
    getUsedWidth() {
        if (this._size === undefined) {
            this._size = this.equation.objects.getSize();
        }
        return this._size.width;
    }
    getHeight() {
        if (this._size === undefined) {
            this._size = this.equation.objects.getSize();
        }
        return this._size.height;
    }
    performLayout(flow) {
        const padding = this.previousXPos || flow.getX();
        this.lastXPos = this.equation.objects.performLayout(flow, padding);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0aC1ydW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWF0aC9tYXRoLXJ1bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQSxNQUFNLE9BQU8sT0FBTztJQU1oQixZQUFZLFFBQWtCO1FBRnRCLFVBQUssR0FBcUIsU0FBUyxDQUFDO1FBR3hDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFTSxZQUFZO1FBQ2YsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUMxQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2hEO1FBQ0QsT0FBTyxJQUFJLENBQUMsS0FBTSxDQUFDLEtBQUssQ0FBQztJQUM3QixDQUFDO0lBRU0sU0FBUztRQUNaLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNoRDtRQUNELE9BQU8sSUFBSSxDQUFDLEtBQU0sQ0FBQyxNQUFNLENBQUM7SUFDOUIsQ0FBQztJQUVNLGFBQWEsQ0FBQyxJQUFpQjtRQUNsQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdkUsQ0FBQztDQUdKIn0=