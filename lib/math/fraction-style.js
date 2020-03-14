export var FractionType;
(function (FractionType) {
    FractionType[FractionType["NoBar"] = 0] = "NoBar";
    FractionType[FractionType["Bar"] = 1] = "Bar";
    FractionType[FractionType["Skewed"] = 2] = "Skewed";
    FractionType[FractionType["Linear"] = 3] = "Linear";
})(FractionType || (FractionType = {}));
export class FractionStyle {
    constructor() {
        this.type = FractionType.NoBar;
    }
    setType(typeStr) {
        switch (typeStr) {
            case "bar":
                this.type = FractionType.Bar;
                break;
            case "skw":
                this.type = FractionType.Skewed;
                break;
            case "lin":
                this.type = FractionType.Linear;
                break;
            case "noBar":
            default:
                this.type = FractionType.NoBar;
                break;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhY3Rpb24tc3R5bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWF0aC9mcmFjdGlvbi1zdHlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLENBQU4sSUFBWSxZQUtYO0FBTEQsV0FBWSxZQUFZO0lBQ3BCLGlEQUFLLENBQUE7SUFDTCw2Q0FBRyxDQUFBO0lBQ0gsbURBQU0sQ0FBQTtJQUNOLG1EQUFNLENBQUE7QUFDVixDQUFDLEVBTFcsWUFBWSxLQUFaLFlBQVksUUFLdkI7QUFFRCxNQUFNLE9BQU8sYUFBYTtJQUExQjtRQUNXLFNBQUksR0FBaUIsWUFBWSxDQUFDLEtBQUssQ0FBQztJQW1CbkQsQ0FBQztJQWpCVSxPQUFPLENBQUMsT0FBMkI7UUFDdEMsUUFBUSxPQUFPLEVBQUU7WUFDYixLQUFLLEtBQUs7Z0JBQ04sSUFBSSxDQUFDLElBQUksR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDO2dCQUM3QixNQUFNO1lBQ1YsS0FBSyxLQUFLO2dCQUNOLElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQztnQkFDaEMsTUFBTTtZQUNWLEtBQUssS0FBSztnQkFDTixJQUFJLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUM7Z0JBQ2hDLE1BQU07WUFDVixLQUFLLE9BQU8sQ0FBQztZQUNiO2dCQUNJLElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQztnQkFDL0IsTUFBTTtTQUNiO0lBQ0wsQ0FBQztDQUNKIn0=