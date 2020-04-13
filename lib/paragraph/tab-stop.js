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
            case "decimal":
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLXN0b3AuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFyYWdyYXBoL3RhYi1zdG9wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRS9DLE1BQU0sQ0FBTixJQUFZLFNBR1g7QUFIRCxXQUFZLFNBQVM7SUFDakIseUNBQUksQ0FBQTtJQUNKLHVDQUFHLENBQUE7QUFDUCxDQUFDLEVBSFcsU0FBUyxLQUFULFNBQVMsUUFHcEI7QUFFRCxNQUFNLENBQU4sSUFBWSxZQU1YO0FBTkQsV0FBWSxZQUFZO0lBQ3BCLGlEQUFLLENBQUE7SUFDTCwrQ0FBSSxDQUFBO0lBQ0osaURBQUssQ0FBQTtJQUNMLG1EQUFNLENBQUE7SUFDTix5REFBUyxDQUFBO0FBQ2IsQ0FBQyxFQU5XLFlBQVksS0FBWixZQUFZLFFBTXZCO0FBRUQsTUFBTSxPQUFPLE9BQU87SUErRGhCLFlBQVksR0FBVyxFQUFFLEtBQW1CLEVBQUUsTUFBaUI7UUE5RHhELGFBQVEsR0FBdUIsU0FBUyxDQUFDO1FBQ3pDLFdBQU0sR0FBYyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBOER0QyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNoQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBN0RNLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBYztRQUNyQyxNQUFNLEtBQUssR0FBYyxFQUFFLENBQUM7UUFDNUIsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDbEMsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QyxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN6RCxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNuRCxJQUFJLFFBQVEsS0FBSyxTQUFTLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtnQkFDakQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNuRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUMvQyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQzVELE1BQU0sSUFBSSxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ2pELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDcEI7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxNQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBYTtRQUMxQyxJQUFJLFNBQVMsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDO1FBQ2xDLFFBQVEsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQ3pCLEtBQUssS0FBSztnQkFDTixTQUFTLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQztnQkFDbkMsTUFBTTtZQUNWLEtBQUssUUFBUTtnQkFDVCxTQUFTLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQztnQkFDaEMsTUFBTTtZQUNWLEtBQUssT0FBTztnQkFDUixTQUFTLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQztnQkFDL0IsTUFBTTtZQUNWLEtBQUssTUFBTTtnQkFDUCxTQUFTLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQztnQkFDOUIsTUFBTTtZQUNWLEtBQUssT0FBTyxDQUFDO1lBQ2IsS0FBSyxTQUFTO2dCQUNWLFNBQVMsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO2dCQUMvQixNQUFNO1lBQ1Y7Z0JBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyw0Q0FBNEMsS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFDakUsTUFBTTtTQUNiO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVPLE1BQU0sQ0FBQyxjQUFjLENBQUMsVUFBOEI7UUFDeEQsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztRQUM1QixJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7WUFDMUIsUUFBUSxVQUFVLENBQUMsV0FBVyxFQUFFLEVBQUU7Z0JBQzlCLEtBQUssS0FBSztvQkFDTixNQUFNLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQztvQkFDdkIsTUFBTTtnQkFDVjtvQkFDSSxNQUFNO2FBQ2I7U0FDSjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFRRCxJQUFXLE9BQU87UUFDZCxPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssWUFBWSxDQUFDLEtBQUssQ0FBQztJQUNsRCxDQUFDO0lBRUQsSUFBVyxhQUFhO1FBQ3BCLElBQUksYUFBYSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7UUFDdkMsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLFlBQVksQ0FBQyxNQUFNLEVBQUU7WUFDekMsYUFBYSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7U0FDeEM7YUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssWUFBWSxDQUFDLEtBQUssRUFBRTtZQUMvQyxhQUFhLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQztTQUN2QztRQUNELE9BQU8sYUFBYSxDQUFDO0lBQ3pCLENBQUM7SUFFTSxhQUFhLENBQUMsSUFBaUI7UUFDbEMsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLFlBQVksQ0FBQyxLQUFLLEVBQUU7WUFDeEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztTQUMzQztJQUNMLENBQUM7Q0FDSiJ9