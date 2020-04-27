import { Box } from "../utils/geometry/box.js";
import { Point } from "../utils/geometry/point.js";
export var ShapeAnchorMode;
(function (ShapeAnchorMode) {
    /** Inline with the text */
    ShapeAnchorMode[ShapeAnchorMode["Inline"] = 0] = "Inline";
    /** Floating on top of text */
    ShapeAnchorMode[ShapeAnchorMode["Floating"] = 1] = "Floating";
})(ShapeAnchorMode || (ShapeAnchorMode = {}));
export var ShapePositionReference;
(function (ShapePositionReference) {
    /** Not relative to any outside element */
    ShapePositionReference[ShapePositionReference["None"] = 0] = "None";
    /** Relative to the current position in the run. X coordinate: character, Y coordinate: line */
    ShapePositionReference[ShapePositionReference["Character"] = 1] = "Character";
    /** Relative to the extents of the column containing this anchor, X coordinate only */
    ShapePositionReference[ShapePositionReference["Column"] = 2] = "Column";
    /** Relative to the Bottom or Right margin */
    ShapePositionReference[ShapePositionReference["EndMargin"] = 3] = "EndMargin";
    /** Relative to the inside margin. X coordinate: left for oddpages, right for even pages. */
    ShapePositionReference[ShapePositionReference["InsideMargin"] = 4] = "InsideMargin";
    /** Relative to the page margins */
    ShapePositionReference[ShapePositionReference["Margin"] = 5] = "Margin";
    /** Relative to the outside margin. X coordinate: right for oddpages, left for even pages. */
    ShapePositionReference[ShapePositionReference["OutsideMargin"] = 6] = "OutsideMargin";
    /** Relative to the edge of the page */
    ShapePositionReference[ShapePositionReference["Page"] = 7] = "Page";
    /** Relative to the Paragraph containing this anchor. Y coordinate only. */
    ShapePositionReference[ShapePositionReference["Paragraph"] = 8] = "Paragraph";
    /** Relative to the Top or Left margin */
    ShapePositionReference[ShapePositionReference["StartMargin"] = 9] = "StartMargin";
})(ShapePositionReference || (ShapePositionReference = {}));
export var ShapePositionAlignMode;
(function (ShapePositionAlignMode) {
    /** Align with Right or Bottom of its Reference */
    ShapePositionAlignMode[ShapePositionAlignMode["End"] = 0] = "End";
    /** Align with Center of its Reference */
    ShapePositionAlignMode[ShapePositionAlignMode["Center"] = 1] = "Center";
    /** Align with Inside of its Reference */
    ShapePositionAlignMode[ShapePositionAlignMode["Inside"] = 2] = "Inside";
    /** Align with Outside of its Reference */
    ShapePositionAlignMode[ShapePositionAlignMode["Outside"] = 3] = "Outside";
    /** Align with Left or Top of its Reference */
    ShapePositionAlignMode[ShapePositionAlignMode["Start"] = 4] = "Start";
})(ShapePositionAlignMode || (ShapePositionAlignMode = {}));
export class ShapeBounds {
    constructor() {
        this.offsetX = 0;
        this.offsetY = 0;
        this.referenceX = ShapePositionReference.None;
        this.referenceY = ShapePositionReference.None;
        this.referenceOffsetX = 0;
        this.referenceOffsetY = 0;
        this.alignX = ShapePositionAlignMode.Start;
        this.alignY = ShapePositionAlignMode.Start;
        this.sizeX = 0;
        this.sizeY = 0;
        this.flipHorizontal = false;
        this.flipVertical = false;
        this.rotation = 0;
        this.anchor = ShapeAnchorMode.Inline;
    }
    getBox(flow) {
        const start = this._getStartPoint(flow);
        return new Box(start.x, start.y, this.sizeX, this.sizeY);
    }
    _getStartPoint(flow) {
        let x = flow.getReferenceX(this.referenceX, this.sizeX);
        let y = flow.getReferenceY(this.referenceY);
        switch (this.referenceX) {
            case ShapePositionReference.None:
                x += this.offsetX;
                break;
            case ShapePositionReference.Column:
            default:
                x += this.referenceOffsetX;
                break;
        }
        switch (this.referenceY) {
            case ShapePositionReference.None:
                y += this.offsetY;
                break;
            case ShapePositionReference.Paragraph:
            default:
                y += this.referenceOffsetY;
                break;
        }
        return new Point(x, y);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcGUtYm91bmRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RyYXdpbmcvc2hhcGUtYm91bmRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFbkQsTUFBTSxDQUFOLElBQVksZUFLWDtBQUxELFdBQVksZUFBZTtJQUN2QiwyQkFBMkI7SUFDM0IseURBQU0sQ0FBQTtJQUNOLDhCQUE4QjtJQUM5Qiw2REFBUSxDQUFBO0FBQ1osQ0FBQyxFQUxXLGVBQWUsS0FBZixlQUFlLFFBSzFCO0FBRUQsTUFBTSxDQUFOLElBQVksc0JBcUJYO0FBckJELFdBQVksc0JBQXNCO0lBQzlCLDBDQUEwQztJQUMxQyxtRUFBSSxDQUFBO0lBQ0osK0ZBQStGO0lBQy9GLDZFQUFTLENBQUE7SUFDVCxzRkFBc0Y7SUFDdEYsdUVBQU0sQ0FBQTtJQUNOLDZDQUE2QztJQUM3Qyw2RUFBUyxDQUFBO0lBQ1QsNEZBQTRGO0lBQzVGLG1GQUFZLENBQUE7SUFDWixtQ0FBbUM7SUFDbkMsdUVBQU0sQ0FBQTtJQUNOLDZGQUE2RjtJQUM3RixxRkFBYSxDQUFBO0lBQ2IsdUNBQXVDO0lBQ3ZDLG1FQUFJLENBQUE7SUFDSiwyRUFBMkU7SUFDM0UsNkVBQVMsQ0FBQTtJQUNULHlDQUF5QztJQUN6QyxpRkFBVyxDQUFBO0FBQ2YsQ0FBQyxFQXJCVyxzQkFBc0IsS0FBdEIsc0JBQXNCLFFBcUJqQztBQUVELE1BQU0sQ0FBTixJQUFZLHNCQVdYO0FBWEQsV0FBWSxzQkFBc0I7SUFDOUIsa0RBQWtEO0lBQ2xELGlFQUFHLENBQUE7SUFDSCx5Q0FBeUM7SUFDekMsdUVBQU0sQ0FBQTtJQUNOLHlDQUF5QztJQUN6Qyx1RUFBTSxDQUFBO0lBQ04sMENBQTBDO0lBQzFDLHlFQUFPLENBQUE7SUFDUCw4Q0FBOEM7SUFDOUMscUVBQUssQ0FBQTtBQUNULENBQUMsRUFYVyxzQkFBc0IsS0FBdEIsc0JBQXNCLFFBV2pDO0FBRUQsTUFBTSxPQUFPLFdBQVc7SUFBeEI7UUFDVyxZQUFPLEdBQVcsQ0FBQyxDQUFDO1FBQ3BCLFlBQU8sR0FBVyxDQUFDLENBQUM7UUFDcEIsZUFBVSxHQUFHLHNCQUFzQixDQUFDLElBQUksQ0FBQztRQUN6QyxlQUFVLEdBQUcsc0JBQXNCLENBQUMsSUFBSSxDQUFDO1FBQ3pDLHFCQUFnQixHQUFXLENBQUMsQ0FBQztRQUM3QixxQkFBZ0IsR0FBVyxDQUFDLENBQUM7UUFDN0IsV0FBTSxHQUFHLHNCQUFzQixDQUFDLEtBQUssQ0FBQztRQUN0QyxXQUFNLEdBQUcsc0JBQXNCLENBQUMsS0FBSyxDQUFDO1FBQ3RDLFVBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUNsQixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQUN2QixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUNyQixhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsV0FBTSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUM7SUE4QjNDLENBQUM7SUE1QlUsTUFBTSxDQUFDLElBQWlCO1FBQzNCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVPLGNBQWMsQ0FBQyxJQUFpQjtRQUNwQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVDLFFBQVEsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNyQixLQUFLLHNCQUFzQixDQUFDLElBQUk7Z0JBQzVCLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNsQixNQUFNO1lBQ1YsS0FBSyxzQkFBc0IsQ0FBQyxNQUFNLENBQUM7WUFDbkM7Z0JBQ0ksQ0FBQyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDM0IsTUFBTTtTQUNiO1FBQ0QsUUFBUSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3JCLEtBQUssc0JBQXNCLENBQUMsSUFBSTtnQkFDNUIsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ2xCLE1BQU07WUFDVixLQUFLLHNCQUFzQixDQUFDLFNBQVMsQ0FBQztZQUN0QztnQkFDSSxDQUFDLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDO2dCQUMzQixNQUFNO1NBQ2I7UUFDRCxPQUFPLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDO0NBQ0oifQ==