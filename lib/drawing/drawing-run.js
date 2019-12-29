export var WrapMode;
(function (WrapMode) {
    WrapMode[WrapMode["None"] = 0] = "None";
    WrapMode[WrapMode["Inline"] = 1] = "Inline";
    WrapMode[WrapMode["Square"] = 2] = "Square";
    WrapMode[WrapMode["Through"] = 3] = "Through";
    WrapMode[WrapMode["Tight"] = 4] = "Tight";
    WrapMode[WrapMode["TopAndBottom"] = 5] = "TopAndBottom";
})(WrapMode || (WrapMode = {}));
export class DrawingRun {
    constructor(bounds, wrapping) {
        this.bounds = bounds;
        this.wrapping = wrapping;
    }
    getUsedWidth() {
        return this.bounds.boundSizeX;
    }
    getHeight() {
        return this.bounds.boundSizeY;
    }
    performLayout(flow) {
        const bounds = this.bounds.box.translate(flow.getX(), flow.getY());
        if (this.picture !== undefined) {
            this.picture.bounds = bounds;
            this.picture.performLayout(flow);
        }
        if (this.chart !== undefined) {
            this.chart.bounds = bounds;
            this.chart.performLayout(flow);
        }
        if (this.shape !== undefined) {
            this.shape.performLayout(bounds);
        }
        this.lastXPos = 0;
        if ((bounds.width > 400) || (this.wrapping !== WrapMode.Inline && this.wrapping !== WrapMode.None)) {
            flow.advancePosition(this.bounds.boundSizeY);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2luZy1ydW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZHJhd2luZy9kcmF3aW5nLXJ1bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPQSxNQUFNLENBQU4sSUFBWSxRQU9YO0FBUEQsV0FBWSxRQUFRO0lBQ2hCLHVDQUFJLENBQUE7SUFDSiwyQ0FBTSxDQUFBO0lBQ04sMkNBQU0sQ0FBQTtJQUNOLDZDQUFPLENBQUE7SUFDUCx5Q0FBSyxDQUFBO0lBQ0wsdURBQVksQ0FBQTtBQUNoQixDQUFDLEVBUFcsUUFBUSxLQUFSLFFBQVEsUUFPbkI7QUFFRCxNQUFNLE9BQU8sVUFBVTtJQVNuQixZQUFZLE1BQW1CLEVBQUUsUUFBa0I7UUFDL0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDN0IsQ0FBQztJQUVNLFlBQVk7UUFDZixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ2xDLENBQUM7SUFFTSxTQUFTO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBRU0sYUFBYSxDQUFDLElBQWlCO1FBQ2xDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDbkUsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEM7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUMzQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNsQztRQUNELElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDcEM7UUFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNoRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDaEQ7SUFDTCxDQUFDO0NBQ0oifQ==