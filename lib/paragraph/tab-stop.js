import { Xml } from "../utils/xml.js";
import { Metrics } from "../utils/metrics.js";
import { Justification } from "./par-style.js";
export var TabLeader;
(function (TabLeader) {
    TabLeader[TabLeader["None"] = 0] = "None";
    TabLeader[TabLeader["Dot"] = 1] = "Dot";
})(TabLeader || (TabLeader = {}));
export var TabAlignment;
(function (TabAlignment) {
    TabAlignment[TabAlignment["Clear"] = 0] = "Clear";
    TabAlignment[TabAlignment["Left"] = 1] = "Left";
    TabAlignment[TabAlignment["Right"] = 2] = "Right";
    TabAlignment[TabAlignment["Center"] = 3] = "Center";
    TabAlignment[TabAlignment["Numbering"] = 4] = "Numbering";
})(TabAlignment || (TabAlignment = {}));
export class TabStop {
    constructor(pos, align, leader) {
        this.position = undefined;
        this.leader = TabLeader.None;
        this._pos = pos;
        this._alignment = align;
        this.leader = leader;
    }
    static fromTabsNode(tabsNode) {
        const stops = [];
        tabsNode.childNodes.forEach(tabNode => {
            const alignStr = Xml.getStringValue(tabNode);
            const leaderAttr = Xml.getAttribute(tabNode, "w:leader");
            const posAttr = Xml.getAttribute(tabNode, "w:pos");
            if (alignStr !== undefined && posAttr !== undefined) {
                const alignment = this._readTabAlignment(alignStr);
                const leader = this._readTabLeader(leaderAttr);
                const pos = Metrics.convertTwipsToPixels(parseInt(posAttr));
                const stop = new TabStop(pos, alignment, leader);
                stops.push(stop);
            }
        });
        return stops;
    }
    static _readTabAlignment(align) {
        let alignment = TabAlignment.Left;
        switch (align.toLowerCase()) {
            case "num":
                alignment = TabAlignment.Numbering;
                break;
            case "center":
                alignment = TabAlignment.Center;
                break;
            case "clear":
                alignment = TabAlignment.Clear;
                break;
            case "left":
                alignment = TabAlignment.Left;
                break;
            case "right":
                alignment = TabAlignment.Right;
                break;
            default:
                console.log(`Unknown tab alignment value encountered: ${align}`);
                break;
        }
        return alignment;
    }
    static _readTabLeader(leaderAttr) {
        let leader = TabLeader.None;
        if (leaderAttr !== undefined) {
            switch (leaderAttr.toLowerCase()) {
                case "dot":
                    leader = TabLeader.Dot;
                    break;
                default:
                    break;
            }
        }
        return leader;
    }
    get isClear() {
        return this._alignment === TabAlignment.Clear;
    }
    get justification() {
        let justification = Justification.left;
        if (this._alignment === TabAlignment.Center) {
            justification = Justification.center;
        }
        else if (this._alignment === TabAlignment.Right) {
            justification = Justification.right;
        }
        return justification;
    }
    performLayout(flow) {
        if (this._alignment !== TabAlignment.Clear) {
            this.position = flow.getX() + this._pos;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLXN0b3AuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFyYWdyYXBoL3RhYi1zdG9wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRS9DLE1BQU0sQ0FBTixJQUFZLFNBR1g7QUFIRCxXQUFZLFNBQVM7SUFDakIseUNBQUksQ0FBQTtJQUNKLHVDQUFHLENBQUE7QUFDUCxDQUFDLEVBSFcsU0FBUyxLQUFULFNBQVMsUUFHcEI7QUFFRCxNQUFNLENBQU4sSUFBWSxZQU1YO0FBTkQsV0FBWSxZQUFZO0lBQ3BCLGlEQUFLLENBQUE7SUFDTCwrQ0FBSSxDQUFBO0lBQ0osaURBQUssQ0FBQTtJQUNMLG1EQUFNLENBQUE7SUFDTix5REFBUyxDQUFBO0FBQ2IsQ0FBQyxFQU5XLFlBQVksS0FBWixZQUFZLFFBTXZCO0FBRUQsTUFBTSxPQUFPLE9BQU87SUE4RGhCLFlBQVksR0FBVyxFQUFFLEtBQW1CLEVBQUUsTUFBaUI7UUE3RHhELGFBQVEsR0FBdUIsU0FBUyxDQUFDO1FBQ3pDLFdBQU0sR0FBYyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBNkR0QyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNoQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBNURNLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBYztRQUNyQyxNQUFNLEtBQUssR0FBYyxFQUFFLENBQUM7UUFDNUIsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDbEMsTUFBTSxRQUFRLEdBQUcsR0FBRyxD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