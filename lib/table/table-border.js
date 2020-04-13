export var TableBorderType;
(function (TableBorderType) {
    TableBorderType[TableBorderType["None"] = 0] = "None";
    TableBorderType[TableBorderType["Single"] = 1] = "Single";
    TableBorderType[TableBorderType["DashDotStroked"] = 2] = "DashDotStroked";
    TableBorderType[TableBorderType["Dashed"] = 3] = "Dashed";
    TableBorderType[TableBorderType["DashSmallGap"] = 4] = "DashSmallGap";
    TableBorderType[TableBorderType["DotDash"] = 5] = "DotDash";
    TableBorderType[TableBorderType["DotDotDash"] = 6] = "DotDotDash";
    TableBorderType[TableBorderType["Dotted"] = 7] = "Dotted";
    TableBorderType[TableBorderType["Double"] = 8] = "Double";
    TableBorderType[TableBorderType["DoubleWave"] = 9] = "DoubleWave";
    TableBorderType[TableBorderType["Inset"] = 10] = "Inset";
    TableBorderType[TableBorderType["Outset"] = 11] = "Outset";
    TableBorderType[TableBorderType["Thick"] = 12] = "Thick";
    TableBorderType[TableBorderType["ThickThinLargeGap"] = 13] = "ThickThinLargeGap";
    TableBorderType[TableBorderType["ThickThinMediumGap"] = 14] = "ThickThinMediumGap";
    TableBorderType[TableBorderType["ThickThinSmallGap"] = 15] = "ThickThinSmallGap";
    TableBorderType[TableBorderType["ThinThickLargeGap"] = 16] = "ThinThickLargeGap";
    TableBorderType[TableBorderType["ThinThickMediumGap"] = 17] = "ThinThickMediumGap";
    TableBorderType[TableBorderType["ThinThickSmallGap"] = 18] = "ThinThickSmallGap";
    TableBorderType[TableBorderType["ThinThickThinLargeGap"] = 19] = "ThinThickThinLargeGap";
    TableBorderType[TableBorderType["ThinThickThinMediumGap"] = 20] = "ThinThickThinMediumGap";
    TableBorderType[TableBorderType["ThinThickThinSmallGap"] = 21] = "ThinThickThinSmallGap";
    TableBorderType[TableBorderType["Emboss3D"] = 22] = "Emboss3D";
    TableBorderType[TableBorderType["Engrave3D"] = 23] = "Engrave3D";
    TableBorderType[TableBorderType["Triple"] = 24] = "Triple";
    TableBorderType[TableBorderType["Wave"] = 25] = "Wave";
})(TableBorderType || (TableBorderType = {}));
export class TableBorder {
    constructor() {
        this.type = TableBorderType.None;
        this.size = 1;
        this.spacing = 0;
        this.color = "000000";
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtYm9yZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3RhYmxlL3RhYmxlLWJvcmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxNQUFNLENBQU4sSUFBWSxlQTJCWDtBQTNCRCxXQUFZLGVBQWU7SUFDdkIscURBQUksQ0FBQTtJQUNKLHlEQUFNLENBQUE7SUFDTix5RUFBYyxDQUFBO0lBQ2QseURBQU0sQ0FBQTtJQUNOLHFFQUFZLENBQUE7SUFDWiwyREFBTyxDQUFBO0lBQ1AsaUVBQVUsQ0FBQTtJQUNWLHlEQUFNLENBQUE7SUFDTix5REFBTSxDQUFBO0lBQ04saUVBQVUsQ0FBQTtJQUNWLHdEQUFLLENBQUE7SUFDTCwwREFBTSxDQUFBO0lBQ04sd0RBQUssQ0FBQTtJQUNMLGdGQUFpQixDQUFBO0lBQ2pCLGtGQUFrQixDQUFBO0lBQ2xCLGdGQUFpQixDQUFBO0lBQ2pCLGdGQUFpQixDQUFBO0lBQ2pCLGtGQUFrQixDQUFBO0lBQ2xCLGdGQUFpQixDQUFBO0lBQ2pCLHdGQUFxQixDQUFBO0lBQ3JCLDBGQUFzQixDQUFBO0lBQ3RCLHdGQUFxQixDQUFBO0lBQ3JCLDhEQUFRLENBQUE7SUFDUixnRUFBUyxDQUFBO0lBQ1QsMERBQU0sQ0FBQTtJQUNOLHNEQUFJLENBQUE7QUFDUixDQUFDLEVBM0JXLGVBQWUsS0FBZixlQUFlLFFBMkIxQjtBQUVELE1BQU0sT0FBTyxXQUFXO0lBTXBCO1FBQ0ksSUFBSSxDQUFDLElBQUksR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7SUFDMUIsQ0FBQztDQUNKIn0=