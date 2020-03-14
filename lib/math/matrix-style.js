export var MatrixYAlign;
(function (MatrixYAlign) {
    MatrixYAlign[MatrixYAlign["Inline"] = 0] = "Inline";
    MatrixYAlign[MatrixYAlign["Top"] = 1] = "Top";
    MatrixYAlign[MatrixYAlign["Center"] = 2] = "Center";
    MatrixYAlign[MatrixYAlign["Bottom"] = 3] = "Bottom";
    MatrixYAlign[MatrixYAlign["Inside"] = 4] = "Inside";
    MatrixYAlign[MatrixYAlign["Outside"] = 5] = "Outside";
})(MatrixYAlign || (MatrixYAlign = {}));
export var MatrixColumnXAlign;
(function (MatrixColumnXAlign) {
    MatrixColumnXAlign[MatrixColumnXAlign["Left"] = 0] = "Left";
    MatrixColumnXAlign[MatrixColumnXAlign["Center"] = 1] = "Center";
    MatrixColumnXAlign[MatrixColumnXAlign["Right"] = 2] = "Right";
    MatrixColumnXAlign[MatrixColumnXAlign["Inside"] = 3] = "Inside";
    MatrixColumnXAlign[MatrixColumnXAlign["Outside"] = 4] = "Outside";
})(MatrixColumnXAlign || (MatrixColumnXAlign = {}));
export var MatrixSpacingRule;
(function (MatrixSpacingRule) {
    MatrixSpacingRule[MatrixSpacingRule["Single"] = 0] = "Single";
    MatrixSpacingRule[MatrixSpacingRule["OneAndAHalf"] = 1] = "OneAndAHalf";
    MatrixSpacingRule[MatrixSpacingRule["Two"] = 2] = "Two";
    MatrixSpacingRule[MatrixSpacingRule["Exactly"] = 3] = "Exactly";
    MatrixSpacingRule[MatrixSpacingRule["Multiple"] = 4] = "Multiple";
})(MatrixSpacingRule || (MatrixSpacingRule = {}));
export class MatrixStyle {
    constructor() {
        this.baseJustification = MatrixYAlign.Inline;
        this.hidePlaceholder = false;
        this.rowSpacingRule = MatrixSpacingRule.Single;
        this.rowSpacing = 1;
        this.columnGapRule = MatrixSpacingRule.Single;
        this.columnGap = 1;
        this.columnMinimalWidth = 1;
        this.columnStyles = undefined;
    }
    setJustification(jcStr) {
        switch (jcStr) {
            case "inline":
            case "top":
            case "center":
            case "bottom":
            case "inside":
            case "outside":
                break;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0cml4LXN0eWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21hdGgvbWF0cml4LXN0eWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sQ0FBTixJQUFZLFlBT1g7QUFQRCxXQUFZLFlBQVk7SUFDcEIsbURBQU0sQ0FBQTtJQUNOLDZDQUFHLENBQUE7SUFDSCxtREFBTSxDQUFBO0lBQ04sbURBQU0sQ0FBQTtJQUNOLG1EQUFNLENBQUE7SUFDTixxREFBTyxDQUFBO0FBQ1gsQ0FBQyxFQVBXLFlBQVksS0FBWixZQUFZLFFBT3ZCO0FBRUQsTUFBTSxDQUFOLElBQVksa0JBTVg7QUFORCxXQUFZLGtCQUFrQjtJQUMxQiwyREFBSSxDQUFBO0lBQ0osK0RBQU0sQ0FBQTtJQUNOLDZEQUFLLENBQUE7SUFDTCwrREFBTSxDQUFBO0lBQ04saUVBQU8sQ0FBQTtBQUNYLENBQUMsRUFOVyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBTTdCO0FBRUQsTUFBTSxDQUFOLElBQVksaUJBTVg7QUFORCxXQUFZLGlCQUFpQjtJQUN6Qiw2REFBTSxDQUFBO0lBQ04sdUVBQVcsQ0FBQTtJQUNYLHVEQUFHLENBQUE7SUFDSCwrREFBTyxDQUFBO0lBQ1AsaUVBQVEsQ0FBQTtBQUNaLENBQUMsRUFOVyxpQkFBaUIsS0FBakIsaUJBQWlCLFFBTTVCO0FBRUQsTUFBTSxPQUFPLFdBQVc7SUFBeEI7UUFDVyxzQkFBaUIsR0FBaUIsWUFBWSxDQUFDLE1BQU0sQ0FBQztRQUN0RCxvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUNqQyxtQkFBYyxHQUFzQixpQkFBaUIsQ0FBQyxNQUFNLENBQUM7UUFDN0QsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixrQkFBYSxHQUFzQixpQkFBaUIsQ0FBQyxNQUFNLENBQUM7UUFDNUQsY0FBUyxHQUFXLENBQUMsQ0FBQztRQUN0Qix1QkFBa0IsR0FBVyxDQUFDLENBQUM7UUFDL0IsaUJBQVksR0FBb0MsU0FBUyxDQUFDO0lBYXJFLENBQUM7SUFYVSxnQkFBZ0IsQ0FBQyxLQUF5QjtRQUM3QyxRQUFRLEtBQUssRUFBRTtZQUNYLEtBQUssUUFBUSxDQUFDO1lBQ2QsS0FBSyxLQUFLLENBQUM7WUFDWCxLQUFLLFFBQVEsQ0FBQztZQUNkLEtBQUssUUFBUSxDQUFDO1lBQ2QsS0FBSyxRQUFRLENBQUM7WUFDZCxLQUFLLFNBQVM7Z0JBQ1YsTUFBTTtTQUNiO0lBQ0wsQ0FBQztDQUNKIn0=