import { MathObject } from "./math-object.js";
import { Size } from "../utils/math/size.js";
import { CharacterObject } from "./character-object.js";
export class DelimiterObject extends MathObject {
    constructor(elem, delimiterStyle, style) {
        super();
        this._elem = elem;
        this._begin = new CharacterObject(delimiterStyle.beginChar, style);
        this._end = new CharacterObject(delimiterStyle.endChar, style);
    }
    getSize() {
        var _a, _b, _c;
        let size = ((_a = this._elem) === null || _a === void 0 ? void 0 : _a.getSize()) || new Size(0, 0);
        size.addHorizontal(((_b = this._begin) === null || _b === void 0 ? void 0 : _b.getSize()) || new Size(0, 0));
        size.addHorizontal(((_c = this._end) === null || _c === void 0 ? void 0 : _c.getSize()) || new Size(0, 0));
        return size;
    }
    performLayout(flow, xPadding) {
        var _a, _b, _c;
        let padding = xPadding;
        padding = ((_a = this._begin) === null || _a === void 0 ? void 0 : _a.performLayout(flow, padding)) || padding;
        padding = ((_b = this._elem) === null || _b === void 0 ? void 0 : _b.performLayout(flow, padding)) || padding;
        padding = ((_c = this._end) === null || _c === void 0 ? void 0 : _c.performLayout(flow, padding)) || padding;
        return padding;
    }
    render(painter) {
        var _a, _b, _c;
        (_a = this._begin) === null || _a === void 0 ? void 0 : _a.render(painter);
        (_b = this._elem) === null || _b === void 0 ? void 0 : _b.render(painter);
        (_c = this._end) === null || _c === void 0 ? void 0 : _c.render(painter);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsaW1pdGVyLW9iamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYXRoL2RlbGltaXRlci1vYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBSTlDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFHeEQsTUFBTSxPQUFPLGVBQWdCLFNBQVEsVUFBVTtJQUszQyxZQUFZLElBQTRCLEVBQUUsY0FBOEIsRUFBRSxLQUFZO1FBQ2xGLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxlQUFlLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRU0sT0FBTzs7UUFDVixJQUFJLElBQUksR0FBRyxPQUFBLElBQUksQ0FBQyxLQUFLLDBDQUFFLE9BQU8sT0FBTSxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFBLElBQUksQ0FBQyxNQUFNLDBDQUFFLE9BQU8sT0FBTSxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQUEsSUFBSSxDQUFDLElBQUksMENBQUUsT0FBTyxPQUFNLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxhQUFhLENBQUMsSUFBaUIsRUFBRSxRQUFnQjs7UUFDcEQsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDO1FBQ3ZCLE9BQU8sR0FBRyxPQUFBLElBQUksQ0FBQyxNQUFNLDBDQUFFLGFBQWEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxNQUFLLE9BQU8sQ0FBQztRQUMvRCxPQUFPLEdBQUcsT0FBQSxJQUFJLENBQUMsS0FBSywwQ0FBRSxhQUFhLENBQUMsSUFBSSxFQUFFLE9BQU8sTUFBSyxPQUFPLENBQUM7UUFDOUQsT0FBTyxHQUFHLE9BQUEsSUFBSSxDQUFDLElBQUksMENBQUUsYUFBYSxDQUFDLElBQUksRUFBRSxPQUFPLE1BQUssT0FBTyxDQUFDO1FBQzdELE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFTSxNQUFNLENBQUMsT0FBaUI7O1FBQzNCLE1BQUEsSUFBSSxDQUFDLE1BQU0sMENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUM3QixNQUFBLElBQUksQ0FBQyxLQUFLLDBDQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUU7UUFDNUIsTUFBQSxJQUFJLENBQUMsSUFBSSwwQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFFO0lBQy9CLENBQUM7Q0FDSiJ9