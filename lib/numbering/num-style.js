import { Xml } from "../utils/xml.js";
export class NumberingStyle {
    constructor(numId, levelIndex) {
        this.numId = numId;
        this._levelIndex = levelIndex;
    }
    static fromNumPresentationNode(numPrNode) {
        let style = undefined;
        if (numPrNode) {
            const indexAttr = Xml.getStringValueFromNode(numPrNode, "w:ilvl");
            const numIdAttr = Xml.getStringValueFromNode(numPrNode, "w:numId");
            if (indexAttr !== undefined && numIdAttr !== undefined) {
                const index = parseInt(indexAttr);
                const numId = parseInt(numIdAttr);
                style = new NumberingStyle(numId, index);
            }
        }
        return style;
    }
    getPrefixText(indices) {
        return (this.level) ? this.level.getText(indices) : "";
    }
    get style() {
        let style = undefined;
        if (this.level !== undefined) {
            style = this.level.style;
        }
        return style;
    }
    applyNumberings(numberings) {
        if (numberings !== undefined) {
            const numbering = numberings.getNumberingById(this.numId);
            if (numbering !== undefined) {
                this.level = numbering.getLevel(this._levelIndex);
            }
            else {
                console.log(`Could not find numbering ID ${this.numId}`);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtLXN0eWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL251bWJlcmluZy9udW0tc3R5bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBSXRDLE1BQU0sT0FBTyxjQUFjO0lBbUJ2QixZQUFZLEtBQWEsRUFBRSxVQUFrQjtRQUN6QyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBakJNLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxTQUFnQztRQUNsRSxJQUFJLEtBQUssR0FBK0IsU0FBUyxDQUFDO1FBQ2xELElBQUksU0FBUyxFQUFFO1lBQ1gsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNsRSxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsc0JBQXNCLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ25FLElBQUksU0FBUyxLQUFLLFNBQVMsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO2dCQUNwRCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ2xDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDbEMsS0FBSyxHQUFHLElBQUksY0FBYyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzthQUM1QztTQUNKO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQU9NLGFBQWEsQ0FBQyxPQUFpQjtRQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzNELENBQUM7SUFFRCxJQUFXLEtBQUs7UUFDWixJQUFJLEtBQUssR0FBc0IsU0FBUyxDQUFDO1FBQ3pDLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDMUIsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1NBQzVCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVNLGVBQWUsQ0FBQyxVQUEwQztRQUM3RCxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7WUFDMUIsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxRCxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDckQ7aUJBQU07Z0JBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDNUQ7U0FDSjtJQUNMLENBQUM7Q0FDSiJ9