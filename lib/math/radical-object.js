import { MathObject } from "./math-object.js";
import { Size } from "../utils/geometry/size.js";
import { CharacterObject } from "./character-object.js";
import { Style } from "../text/style.js";
export class RadicalObject extends MathObject {
    constructor(degree, elem, style) {
        super();
        this._degree = degree;
        this._elem = elem;
        this._radical = new CharacterObject("U0x221A", new Style());
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
        elemSize.width += 20;
        elemSize.height += 20;
        return elemSize;
    }
    performLayout(flow, xPadding) {
        var _a, _b, _c;
        let padding = xPadding;
        padding = ((_a = this._degree) === null || _a === void 0 ? void 0 : _a.performLayout(flow, padding)) || padding;
        padding = ((_b = this._radical) === null || _b === void 0 ? void 0 : _b.performLayout(flow, padding)) || padding;
        padding = ((_c = this._elem) === null || _c === void 0 ? void 0 : _c.performLayout(flow, padding)) || padding;
        return padding;
    }
    render(painter) {
        var _a, _b, _c;
        (_a = this._degree) === null || _a === void 0 ? void 0 : _a.render(painter);
        (_b = this._radical) === null || _b === void 0 ? void 0 : _b.render(painter);
        (_c = this._elem) === null || _c === void 0 ? void 0 : _c.render(painter);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaWNhbC1vYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWF0aC9yYWRpY2FsLW9iamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFJOUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFekMsTUFBTSxPQUFPLGFBQWMsU0FBUSxVQUFVO0lBTXpDLFlBQVksTUFBOEIsRUFBRSxJQUE0QixFQUFFLEtBQW1CO1FBQ3pGLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxPQUFPO1FBQ1YsSUFBSSxRQUFlLENBQUM7UUFDcEIsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUMxQixRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNuQzthQUFNO1lBQ0gsUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUM3QjtRQUNELFFBQVEsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ3JCLFFBQVEsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1FBQ3RCLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFTSxhQUFhLENBQUMsSUFBaUIsRUFBRSxRQUFnQjs7UUFDcEQsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDO1FBQ3ZCLE9BQU8sR0FBRyxPQUFBLElBQUksQ0FBQyxPQUFPLDBDQUFFLGFBQWEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxNQUFLLE9BQU8sQ0FBQztRQUNoRSxPQUFPLEdBQUcsT0FBQSxJQUFJLENBQUMsUUFBUSwwQ0FBRSxhQUFhLENBQUMsSUFBSSxFQUFFLE9BQU8sTUFBSyxPQUFPLENBQUM7UUFDakUsT0FBTyxHQUFHLE9BQUEsSUFBSSxDQUFDLEtBQUssMENBQUUsYUFBYSxDQUFDLElBQUksRUFBRSxPQUFPLE1BQUssT0FBTyxDQUFDO1FBQzlELE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFTSxNQUFNLENBQUMsT0FBaUI7O1FBQzNCLE1BQUEsSUFBSSxDQUFDLE9BQU8sMENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUM5QixNQUFBLElBQUksQ0FBQyxRQUFRLDBDQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUU7UUFDL0IsTUFBQSxJQUFJLENBQUMsS0FBSywwQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFFO0lBQ2hDLENBQUM7Q0FDSiJ9