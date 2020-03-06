import { ShapeAnchorMode } from "./shape-bounds.js";
export var WrapMode;
(function (WrapMode) {
    WrapMode[WrapMode["None"] = 0] = "None";
    WrapMode[WrapMode["Square"] = 1] = "Square";
    WrapMode[WrapMode["Through"] = 2] = "Through";
    WrapMode[WrapMode["Tight"] = 3] = "Tight";
    WrapMode[WrapMode["TopAndBottom"] = 4] = "TopAndBottom";
})(WrapMode || (WrapMode = {}));
export class DrawingRun {
    constructor(bounds, wrapping) {
        this.bounds = bounds;
        this.wrapping = wrapping;
    }
    getUsedWidth() {
        return this.bounds.sizeX;
    }
    getHeight() {
        return this.bounds.sizeY;
    }
    performLayout(flow) {
        const bounds = this.bounds.getBox(flow);
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
        if ((bounds.width > 400) || (this.bounds.anchor !== ShapeAnchorMode.Inline && this.wrapping !== WrapMode.None)) {
            flow.advancePosition(this.bounds.sizeY);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2luZy1ydW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZHJhd2luZy9kcmF3aW5nLXJ1bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFPakUsTUFBTSxDQUFOLElBQVksUUFNWDtBQU5ELFdBQVksUUFBUTtJQUNoQix1Q0FBSSxDQUFBO0lBQ0osMkNBQU0sQ0FBQTtJQUNOLDZDQUFPLENBQUE7SUFDUCx5Q0FBSyxDQUFBO0lBQ0wsdURBQVksQ0FBQTtBQUNoQixDQUFDLEVBTlcsUUFBUSxLQUFSLFFBQVEsUUFNbkI7QUFFRCxNQUFNLE9BQU8sVUFBVTtJQVNuQixZQUFZLE1BQW1CLEVBQUUsUUFBa0I7UUFDL0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDN0IsQ0FBQztJQUVNLFlBQVk7UUFDZixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQzdCLENBQUM7SUFFTSxTQUFTO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUM3QixDQUFDO0lBRU0sYUFBYSxDQUFDLElBQWlCO1FBQ2xDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3BDO1FBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEM7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3BDO1FBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxlQUFlLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMzQztJQUNMLENBQUM7Q0FDSiJ9