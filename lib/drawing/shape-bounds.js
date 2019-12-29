import { Xml } from "../utils/xml.js";
import { Metrics } from "../utils/metrics.js";
import { Box } from "../math/box.js";
export class ShapeBounds {
    constructor() {
        this.boundOffsetX = 0;
        this.boundOffsetY = 0;
        this.boundSizeX = 0;
        this.boundSizeY = 0;
        this.flipHorizontal = false;
        this.flipVertical = false;
        this.rotation = 0;
        this.anchor = "";
    }
    static fromShapePropertiesNode(shapePropNode) {
        const bounds = new ShapeBounds();
        bounds.anchor = "absolute";
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
                    bounds.boundOffsetX = Metrics.convertEmuToPixels(parseInt(offsetX));
                }
                const offsetY = Xml.getAttribute(offset, "y");
                if (offsetY !== undefined) {
                    bounds.boundOffsetY = Metrics.convertEmuToPixels(parseInt(offsetY));
                }
            }
            ShapeBounds.readExtent(frame, "a:ext", bounds);
        }
        return bounds;
    }
    static fromInlineNode(inlineNode) {
        const bounds = new ShapeBounds();
        bounds.anchor = "inline";
        ShapeBounds.readExtent(inlineNode, "wp:extent", bounds);
        return bounds;
    }
    static fromAnchorNode(anchorNode) {
        const bounds = new ShapeBounds();
        bounds.anchor = "anchor";
        ShapeBounds.readExtent(anchorNode, "wp:extent", bounds);
        return bounds;
    }
    get box() {
        return new Box(this.boundOffsetX, this.boundOffsetY, this.boundSizeX, this.boundSizeY);
    }
    static readExtent(parent, nodeName, bounds) {
        const extent = Xml.getFirstChildOfName(parent, nodeName);
        if (extent !== undefined) {
            const extentX = Xml.getAttribute(extent, "cx");
            if (extentX !== undefined) {
                bounds.boundSizeX = Metrics.convertEmuToPixels(parseInt(extentX));
            }
            const extentY = Xml.getAttribute(extent, "cy");
            if (extentY !== undefined) {
                bounds.boundSizeY = Metrics.convertEmuToPixels(parseInt(extentY));
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcGUtYm91bmRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RyYXdpbmcvc2hhcGUtYm91bmRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXJDLE1BQU0sT0FBTyxXQUFXO0lBQXhCO1FBQ1csaUJBQVksR0FBVyxDQUFDLENBQUM7UUFDekIsaUJBQVksR0FBVyxDQUFDLENBQUM7UUFDekIsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFDYixXQUFNLEdBQUcsRUFBRSxDQUFDO0lBbUV2QixDQUFDO0lBakVVLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxhQUF3QjtRQUMxRCxNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO1FBQzNCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDL0QsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3JCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQy9DLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtnQkFDckIsTUFBTSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7YUFDaEM7WUFDRCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUss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