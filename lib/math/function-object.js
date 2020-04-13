import { MathObject } from "./math-object.js";
import { Size } from "../utils/geometry/size.js";
export class FunctionObject extends MathObject {
    constructor(functionName, elem, style) {
        super();
        this._functionName = functionName;
        this._elem = elem;
        this.style = style;
    }
    getSize() {
        let elemSize;
        if (this._elem !== undefined) {
            elemSize = this._elem.getSize();
        }
        else {
            elemSize = new Size(0, 0);
        }
        let nameSize;
        if (this._functionName !== undefined) {
            nameSize = this._functionName.getSize();
        }
        else {
            nameSize = new Size(0, 0);
        }
        const size = nameSize.addVertical(elemSize);
        return size;
    }
    performLayout(flow, xPadding) {
        var _a, _b;
        let padding = ((_a = this._functionName) === null || _a === void 0 ? void 0 : _a.performLayout(flow, xPadding)) || xPadding;
        return ((_b = this._elem) === null || _b === void 0 ? void 0 : _b.performLayout(flow, padding)) || padding;
    }
    render(painter) {
        var _a, _b;
        (_a = this._functionName) === null || _a === void 0 ? void 0 : _a.render(painter);
        (_b = this._elem) === null || _b === void 0 ? void 0 : _b.render(painter);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24tb2JqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21hdGgvZnVuY3Rpb24tb2JqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUk5QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFakQsTUFBTSxPQUFPLGNBQWUsU0FBUSxVQUFVO0lBSzFDLFlBQVksWUFBb0MsRUFBRSxJQUE0QixFQUFFLEtBQW9CO1FBQ2hHLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7UUFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVNLE9BQU87UUFDVixJQUFJLFFBQWMsQ0FBQztRQUNuQixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQzFCLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ25DO2FBQU07WUFDSCxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzdCO1FBQ0QsSUFBSSxRQUFjLENBQUM7UUFDbkIsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLFNBQVMsRUFBRTtZQUNsQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUMzQzthQUFNO1lBQ0gsUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUM3QjtRQUNELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLGFBQWEsQ0FBQyxJQUFpQixFQUFFLFFBQWdCOztRQUNwRCxJQUFJLE9BQU8sR0FBRyxPQUFBLElBQUksQ0FBQyxhQUFhLDBDQUFFLGFBQWEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxNQUFLLFFBQVEsQ0FBQztRQUM1RSxPQUFPLE9BQUEsSUFBSSxDQUFDLEtBQUssMENBQUUsYUFBYSxDQUFDLElBQUksRUFBRSxPQUFPLE1BQUssT0FBTyxDQUFDO0lBQy9ELENBQUM7SUFFTSxNQUFNLENBQUMsT0FBaUI7O1FBQzNCLE1BQUEsSUFBSSxDQUFDLGFBQWEsMENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUNwQyxNQUFBLElBQUksQ0FBQyxLQUFLLDBDQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUU7SUFDaEMsQ0FBQztDQUNKIn0=