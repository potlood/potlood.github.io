import { MatrixColumnXAlign } from "./matrix-style.js";
export class MatrixColumnStyle {
    constructor() {
        this.count = 0;
        this.justification = MatrixColumnXAlign.Center;
    }
    setJustification(jcStr) {
        switch (jcStr) {
            case "left":
                this.justification = MatrixColumnXAlign.Left;
                break;
            case "right":
                this.justification = MatrixColumnXAlign.Right;
                break;
            case "inside":
                this.justification = MatrixColumnXAlign.Inside;
                break;
            case "outside":
                this.justification = MatrixColumnXAlign.Outside;
                break;
            case "center":
            default:
                this.justification = MatrixColumnXAlign.Center;
                break;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0cml4LWNvbHVtbi1zdHlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYXRoL21hdHJpeC1jb2x1bW4tc3R5bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFdkQsTUFBTSxPQUFPLGlCQUFpQjtJQUE5QjtRQUNXLFVBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsa0JBQWEsR0FBdUIsa0JBQWtCLENBQUMsTUFBTSxDQUFDO0lBc0J6RSxDQUFDO0lBcEJVLGdCQUFnQixDQUFDLEtBQXlCO1FBQzdDLFFBQVEsS0FBSyxFQUFFO1lBQ1gsS0FBSyxNQUFNO2dCQUNQLElBQUksQ0FBQyxhQUFhLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDO2dCQUM3QyxNQUFNO1lBQ1YsS0FBSyxPQUFPO2dCQUNSLElBQUksQ0FBQyxhQUFhLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDO2dCQUM5QyxNQUFNO1lBQ1YsS0FBSyxRQUFRO2dCQUNULElBQUksQ0FBQyxhQUFhLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDO2dCQUMvQyxNQUFNO1lBQ1YsS0FBSyxTQUFTO2dCQUNWLElBQUksQ0FBQyxhQUFhLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxDQUFDO2dCQUNoRCxNQUFNO1lBQ1YsS0FBSyxRQUFRLENBQUM7WUFDZDtnQkFDSSxJQUFJLENBQUMsYUFBYSxHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztnQkFDL0MsTUFBTTtTQUNiO0lBQ0wsQ0FBQztDQUNKIn0=