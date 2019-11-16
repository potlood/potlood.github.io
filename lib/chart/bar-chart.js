import { BaseChart } from "./base-chart.js";
export var ChartOrientation;
(function (ChartOrientation) {
    ChartOrientation[ChartOrientation["Horizontal"] = 0] = "Horizontal";
    ChartOrientation[ChartOrientation["Vertical"] = 1] = "Vertical";
})(ChartOrientation || (ChartOrientation = {}));
export class BarChart extends BaseChart {
    constructor(space) {
        super(space);
        this.orientation = ChartOrientation.Horizontal;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFyLWNoYXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYXJ0L2Jhci1jaGFydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFNUMsTUFBTSxDQUFOLElBQVksZ0JBR1g7QUFIRCxXQUFZLGdCQUFnQjtJQUN4QixtRUFBVSxDQUFBO0lBQ1YsK0RBQVEsQ0FBQTtBQUNaLENBQUMsRUFIVyxnQkFBZ0IsS0FBaEIsZ0JBQWdCLFFBRzNCO0FBRUQsTUFBTSxPQUFPLFFBQVMsU0FBUSxTQUFTO0lBRW5DLFlBQVksS0FBaUI7UUFDekIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRlYsZ0JBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7SUFHakQsQ0FBQztDQUVKIn0=