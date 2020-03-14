import { MathObject } from "./math-object.js";
import { Size } from "../utils/math/size.js";
export class FractionObject extends MathObject {
    constructor(numerator, denumerator, style) {
        super();
        this._numerator = numerator;
        this._denumerator = denumerator;
        this.style = style;
    }
    getSize() {
        let denominatorSize;
        if (this._denumerator !== undefined) {
            denominatorSize = this._denumerator.getSize();
        }
        else {
            denominatorSize = new Size(0, 0);
        }
        let numeratorSize;
        if (this._numerator !== undefined) {
            numeratorSize = this._numerator.getSize();
        }
        else {
            numeratorSize = new Size(0, 0);
        }
        return denominatorSize.addVertical(numeratorSize, 20);
    }
    performLayout(flow, xPadding) {
        var _a, _b;
        const numPadding = ((_a = this._numerator) === null || _a === void 0 ? void 0 : _a.performLayout(flow, xPadding)) || xPadding;
        const denPadding = ((_b = this._denumerator) === null || _b === void 0 ? void 0 : _b.performLayout(flow, xPadding)) || xPadding;
        return Math.max(numPadding, denPadding);
    }
    render(painter) {
        var _a, _b;
        (_a = this._numerator) === null || _a === void 0 ? void 0 : _a.render(painter);
        (_b = this._denumerator) === null || _b === void 0 ? void 0 : _b.render(painter);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhY3Rpb24tb2JqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21hdGgvZnJhY3Rpb24tb2JqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUk5QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFN0MsTUFBTSxPQUFPLGNBQWUsU0FBUSxVQUFVO0lBSzFDLFlBQVksU0FBaUMsRUFBRSxXQUFtQyxFQUFFLEtBQW9CO1FBQ3BHLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFDNUIsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVNLE9BQU87UUFDVixJQUFJLGVBQXFCLENBQUM7UUFDMUIsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtZQUNqQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNqRDthQUFNO1lBQ0gsZUFBZSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNwQztRQUNELElBQUksYUFBbUIsQ0FBQztRQUN4QixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO1lBQy9CLGFBQWEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQzdDO2FBQU07WUFDSCxhQUFhLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ2xDO1FBQ0QsT0FBTyxlQUFlLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRU0sYUFBYSxDQUFDLElBQWlCLEVBQUUsUUFBZ0I7O1FBQ3BELE1BQU0sVUFBVSxHQUFHLE9BQUEsSUFBSSxDQUFDLFVBQVUsMENBQUUsYUFBYSxDQUFDLElBQUksRUFBRSxRQUFRLE1BQUssUUFBUSxDQUFDO1FBQzlFLE1BQU0sVUFBVSxHQUFHLE9BQUEsSUFBSSxDQUFDLFlBQVksMENBQUUsYUFBYSxDQUFDLElBQUksRUFBRSxRQUFRLE1BQUssUUFBUSxDQUFDO1FBQ2hGLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxPQUFpQjs7UUFDM0IsTUFBQSxJQUFJLENBQUMsVUFBVSwwQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFFO1FBQ2pDLE1BQUEsSUFBSSxDQUFDLFlBQVksMENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRTtJQUN2QyxDQUFDO0NBQ0oifQ==