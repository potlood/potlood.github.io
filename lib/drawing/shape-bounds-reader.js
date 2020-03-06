import { Xml } from "../utils/xml.js";
import { Metrics } from "../utils/metrics.js";
import { ShapeBounds, ShapeAnchorMode, ShapePositionReference, ShapePositionAlignMode } from "./shape-bounds.js";
export class ShapeBoundsReader {
    static fromShapePropertiesNode(shapePropNode) {
        const bounds = new ShapeBounds();
        bounds.anchor = ShapeAnchorMode.Floating;
        const frame = Xml.getFirstChildOfName(shapePropNode, "a:xfrm");
        if (frame !== undefined) {
            const flipH = Xml.getAttribute(frame, "flipH");
            if (flipH !== undefined) {
                bounds.flipHorizontal = true;
            }
            const flipV = Xml.getAttribute(frame, "flipV");
            if (flipV !== undefined) {
                bounds.flipVertical = true;
            }
            const rot = Xml.getAttribute(frame, "rot");
            if (rot !== undefined) {
                bounds.rotation = Metrics.convertRotationToRadians(parseInt(rot));
            }
            const offset = Xml.getFirstChildOfName(frame, "a:off");
            if (offset !== undefined) {
                const offsetX = Xml.getAttribute(offset, "x");
                if (offsetX !== undefined) {
                    bounds.offsetX = Metrics.convertEmuToPixels(parseInt(offsetX));
                }
                const offsetY = Xml.getAttribute(offset, "y");
                if (offsetY !== undefined) {
                    bounds.offsetY = Metrics.convertEmuToPixels(parseInt(offsetY));
                }
            }
            ShapeBoundsReader._readExtent(frame, "a:ext", bounds);
        }
        return bounds;
    }
    static fromInlineNode(inlineNode) {
        const bounds = new ShapeBounds();
        bounds.anchor = ShapeAnchorMode.Inline;
        ShapeBoundsReader._readExtent(inlineNode, "wp:extent", bounds);
        ShapeBoundsReader._readHorizontalPosition(inlineNode, bounds);
        ShapeBoundsReader._readVerticalPosition(inlineNode, bounds);
        return bounds;
    }
    static fromAnchorNode(anchorNode) {
        const bounds = new ShapeBounds();
        bounds.anchor = ShapeAnchorMode.Floating;
        ShapeBoundsReader._readExtent(anchorNode, "wp:extent", bounds);
        ShapeBoundsReader._readHorizontalPosition(anchorNode, bounds);
        ShapeBoundsReader._readVerticalPosition(anchorNode, bounds);
        return bounds;
    }
    static _readHorizontalPosition(parent, bounds) {
        const horPos = Xml.getFirstChildOfName(parent, "wp:positionH");
        if (horPos !== undefined) {
            const reference = ShapeBoundsReader._readPositionReference(horPos);
            if (reference !== undefined) {
                bounds.referenceX = reference;
            }
            const referenceOffset = ShapeBoundsReader._readPositionReferenceOffset(horPos);
            bounds.referenceOffsetX = referenceOffset;
            const align = ShapeBoundsReader._readPositionAlignment(horPos);
            if (align !== undefined) {
                bounds.alignX = align;
            }
        }
    }
    static _readVerticalPosition(parent, bounds) {
        const vertPos = Xml.getFirstChildOfName(parent, "wp:positionV");
        if (vertPos !== undefined) {
            const reference = ShapeBoundsReader._readPositionReference(vertPos);
            if (reference !== undefined) {
                bounds.referenceY = reference;
            }
            const referenceOffset = ShapeBoundsReader._readPositionReferenceOffset(vertPos);
            bounds.referenceOffsetY = referenceOffset;
            const align = ShapeBoundsReader._readPositionAlignment(vertPos);
            if (align !== undefined) {
                bounds.alignY = align;
            }
        }
    }
    static _readPositionReference(node) {
        let reference = undefined;
        const relativeFrom = Xml.getAttribute(node, "relativeFrom");
        if (relativeFrom !== undefined) {
            switch (relativeFrom.toLowerCase()) {
                case "character":
                case "line":
                    reference = ShapePositionReference.Character;
                    break;
                case "column":
                    reference = ShapePositionReference.Column;
                    break;
                case "leftmargin":
                case "topmargin":
                    reference = ShapePositionReference.StartMargin;
                    break;
                case "rightmargin":
                case "bottommargin":
                    reference = ShapePositionReference.EndMargin;
                    break;
                case "insidemargin":
                    reference = ShapePositionReference.InsideMargin;
                    break;
                case "outsidemargin":
                    reference = ShapePositionReference.OutsideMargin;
                    break;
                case "margin":
                    reference = ShapePositionReference.Margin;
                    break;
                case "page":
                    reference = ShapePositionReference.Page;
                    break;
                case "paragraph":
                    reference = ShapePositionReference.Paragraph;
                    break;
            }
        }
        return reference;
    }
    static _readPositionAlignment(node) {
        let align = undefined;
        const alignNode = Xml.getFirstChildOfName(node, "wp:align");
        if (alignNode !== undefined && alignNode.textContent !== null) {
            switch (alignNode.textContent.toLowerCase()) {
                case "left":
                case "top":
                    align = ShapePositionAlignMode.Start;
                    break;
                case "right":
                case "bottom":
                    align = ShapePositionAlignMode.End;
                    break;
                case "inside":
                    align = ShapePositionAlignMode.Inside;
                    break;
                case "outside":
                    align = ShapePositionAlignMode.Outside;
                    break;
                case "center":
                    align = ShapePositionAlignMode.Center;
                    break;
            }
        }
        return align;
    }
    static _readPositionReferenceOffset(node) {
        let offset = 0;
        const offsetNode = Xml.getFirstChildOfName(node, "wp:posOffset");
        if (offsetNode !== undefined && offsetNode.textContent !== null) {
            offset = Metrics.convertEmuToPixels(parseInt(offsetNode.textContent));
        }
        return offset;
    }
    static _readExtent(parent, nodeName, bounds) {
        const extent = Xml.getFirstChildOfName(parent, nodeName);
        if (extent !== undefined) {
            const extentX = Xml.getAttribute(extent, "cx");
            if (extentX !== undefined) {
                bounds.sizeX = Metrics.convertEmuToPixels(parseInt(extentX));
            }
            const extentY = Xml.getAttribute(extent, "cy");
            if (extentY !== undefined) {
                bounds.sizeY = Metrics.convertEmuToPixels(parseInt(extentY));
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcGUtYm91bmRzLXJlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kcmF3aW5nL3NoYXBlLWJvdW5kcy1yZWFkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3RDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxzQkFBc0IsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRWpILE1BQU0sT0FBTyxpQkFBaUI7SUFFbkIsTUFBTSxDQUFDLHVCQUF1QixDQUFDLGFBQXdCO1FBQzFELE1BQU0sTUFBTSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFDakMsTUFBTSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsUUFBUSxDQUFDO1FBQ3pDLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDL0QsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3JCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQy9DLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtnQkFDckIsTUFBTSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7YUFDaEM7WUFDRCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMvQyxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7Z0JBQ3JCLE1BQU0sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2FBQzlCO1lBQ0QsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDM0MsSUFB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