import { Angle } from "../utils/geometry/angle.js";
class MultiplyDevideFormula {
    constructor(name, x, y, z) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    evaluate(guide) {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        const z = guide.getValue(this.z);
        return (x * y) / z;
    }
    toString() {
        return `${this.name}: */ ${this.x} ${this.y} ${this.z}`;
    }
}
class AddSubtractFormula {
    constructor(name, x, y, z) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    evaluate(guide) {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        const z = guide.getValue(this.z);
        return (x + y) - z;
    }
    toString() {
        return `${this.name}: +- ${this.x} ${this.y} ${this.z}`;
    }
}
class AddDevideFormula {
    constructor(name, x, y, z) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    evaluate(guide) {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        const z = guide.getValue(this.z);
        return (x + y) / z;
    }
    toString() {
        return `${this.name}: +* ${this.x} ${this.y} ${this.z}`;
    }
}
class IfElseFormula {
    constructor(name, x, y, z) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    evaluate(guide) {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        const z = guide.getValue(this.z);
        return (x > 0) ? y : z;
    }
    toString() {
        return `${this.name}: ?: ${this.x} ${this.y} ${this.z}`;
    }
}
class AbsoluteFormula {
    constructor(name, x) {
        this.name = name;
        this.x = x;
    }
    evaluate(guide) {
        const x = guide.getValue(this.x);
        return Math.abs(x);
    }
    toString() {
        return `${this.name}: abs ${this.x}`;
    }
}
class ArcTanFormula {
    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
    }
    evaluate(guide) {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        return Math.atan2(y, x);
    }
    toString() {
        return `${this.name}: at2 ${this.x} ${this.y}`;
    }
}
class CosineArcTanFormula {
    constructor(name, x, y, z) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    evaluate(guide) {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        const z = guide.getValue(this.z);
        return (x * Math.cos(Math.atan2(z, y)));
    }
    toString() {
        return `${this.name}: cat2 ${this.x} ${this.y} ${this.z}`;
    }
}
class CosineFormula {
    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
    }
    evaluate(guide) {
        const x = guide.getValue(this.x);
        const y = guide.getAngleValue(this.y);
        return x * Math.cos(y.toRadians());
    }
    toString() {
        return `${this.name}: cos ${this.x} ${this.y}`;
    }
}
class MaximumFormula {
    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
    }
    evaluate(guide) {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        return Math.max(x, y);
    }
    toString() {
        return `${this.name}: max ${this.x} ${this.y}`;
    }
}
class MinimumFormula {
    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
    }
    evaluate(guide) {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        return Math.min(x, y);
    }
    toString() {
        return `${this.name}: min ${this.x} ${this.y}`;
    }
}
class ModuloFormula {
    constructor(name, x, y, z) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    evaluate(guide) {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        const z = guide.getValue(this.z);
        return Math.sqrt(x * x + y * y + z * z);
    }
    toString() {
        return `${this.name}: mod ${this.x} ${this.y} ${this.z}`;
    }
}
class PinFormula {
    constructor(name, x, y, z) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    evaluate(guide) {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        const z = guide.getValue(this.z);
        return (y < x) ? x : (y > z) ? z : y;
    }
    toString() {
        return `${this.name}: pin ${this.x} ${this.y} ${this.z}`;
    }
}
class SineArcTanFormula {
    constructor(name, x, y, z) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    evaluate(guide) {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        const z = guide.getValue(this.z);
        return x * Math.sin(Math.atan2(z, y));
    }
    toString() {
        return `${this.name}: sat2 ${this.x} ${this.y} ${this.z}`;
    }
}
class SineFormula {
    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
    }
    evaluate(guide) {
        const x = guide.getValue(this.x);
        const y = guide.getAngleValue(this.y);
        return x * Math.sin(y.toRadians());
    }
    toString() {
        return `${this.name}: sin ${this.x} ${this.y}`;
    }
}
class SquareRootFormula {
    constructor(name, x) {
        this.name = name;
        this.x = x;
    }
    evaluate(guide) {
        const x = guide.getValue(this.x);
        return Math.sqrt(x);
    }
    toString() {
        return `${this.name}: sqrt ${this.x}`;
    }
}
class TangentFormula {
    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
    }
    evaluate(guide) {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        return x * Math.tan(y);
    }
    toString() {
        return `${this.name}: tan ${this.x} ${this.y}`;
    }
}
class LiteralValueFormula {
    constructor(name, x) {
        this.name = name;
        this.x = x;
    }
    evaluate(guide) {
        const x = guide.getValue(this.x);
        return x;
    }
    toString() {
        return `${this.name}: val ${this.x}`;
    }
}
class FunctionFormula {
    constructor(name, func) {
        this.name = name;
        this.func = func;
    }
    evaluate(guide) {
        return this.func(guide.shape);
    }
    toString() {
        return `${this.name}: function`;
    }
}
export class ShapeGuide {
    constructor(shape) {
        this._formulas = [];
        this._variables = [];
        this.shape = shape;
    }
    addFormula(formula, name) {
        const parts = formula.split(' ');
        if (parts.length < 2) {
            console.log(`Invalid formula for shape guide: ${formula}`);
            return;
        }
        let form = undefined;
        switch (parts[0]) {
            case "*/":
                form = new MultiplyDevideFormula(name, parts[1], parts[2], parts[3]);
                break;
            case "+-":
                form = new AddSubtractFormula(name, parts[1], parts[2], parts[3]);
                break;
            case "+/":
                form = new AddDevideFormula(name, parts[1], parts[2], parts[3]);
                break;
            case "?:":
                form = new IfElseFormula(name, parts[1], parts[2], parts[3]);
                break;
            case "abs":
                form = new AbsoluteFormula(name, parts[1]);
                break;
            case "at2":
                form = new ArcTanFormula(name, parts[1], parts[2]);
                break;
            case "cat2":
                form = new CosineArcTanFormula(name, parts[1], parts[2], parts[3]);
                break;
            case "cos":
                form = new CosineFormula(name, parts[1], parts[2]);
                break;
            case "max":
                form = new MaximumFormula(name, parts[1], parts[2]);
                break;
            case "min":
                form = new MinimumFormula(name, parts[1], parts[2]);
                break;
            case "mod":
                form = new ModuloFormula(name, parts[1], parts[2], parts[3]);
                break;
            case "pin":
                form = new PinFormula(name, parts[1], parts[2], parts[3]);
                break;
            case "sat2":
                form = new SineArcTanFormula(name, parts[1], parts[2], parts[3]);
                break;
            case "sin":
                form = new SineFormula(name, parts[1], parts[2]);
                break;
            case "sqrt":
                form = new SquareRootFormula(name, parts[1]);
                break;
            case "tan":
                form = new TangentFormula(name, parts[1], parts[2]);
                break;
            case "val":
                form = new LiteralValueFormula(name, parts[1]);
                break;
            default:
                console.log(`Don't know how to interpret formula: ${parts[0]}`);
                break;
        }
        if (form !== undefined) {
            this._formulas.push(form);
        }
    }
    getValue(statement) {
        let val;
        const isNumber = /^(\d|-)/.test(statement) && statement.indexOf("cd") === -1;
        if (isNumber) {
            val = parseFloat(statement);
        }
        else {
            val = this._getVariableValue(statement);
        }
        return val;
    }
    getAngleValue(statement) {
        const val = this.getValue(statement);
        const angle = Angle.fromRotation(val);
        return angle;
    }
    evaluate() {
        this._formulas.forEach(formula => {
            this._evaluateVariable(formula);
        });
    }
    getVariableValueSummary() {
        return this._variables.map(val => `${val.name}:${val.val}`).join(";");
    }
    _getVariableValue(name) {
        let val = this._variables.find((current) => current.name === name);
        if (val === undefined) {
            // Check pre-defined variables.
            // Taken from: https://social.msdn.microsoft.com/Forums/en-US/3f69ebb3-62a0-4fdd-b367-64790dfb2491/presetshapedefinitionsxml-does-not-specify-width-and-height-form-some-autoshapes?forum=os_binaryfile
            switch (name) {
                case "h":
                    // Height
                    val = this._createNamedVariable(new FunctionFormula("h", (shape) => shape.height));
                    break;
                case "hd2":
                    // Height / 2
                    val = this._createNamedVariable(new FunctionFormula("hd2", (shape) => shape.height / 2));
                    break;
                case "hd3":
                    // Height / 3
                    val = this._createNamedVariable(new FunctionFormula("hd3", (shape) => shape.height / 3));
                    break;
                case "hd4":
                    // Height / 4
                    val = this._createNamedVariable(new FunctionFormula("hd4", (shape) => shape.height / 4));
                    break;
                case "hd5":
                    // Height / 5
                    val = this._createNamedVariable(new FunctionFormula("hd5", (shape) => shape.height / 5));
                    break;
                case "hd6":
                    // Height / 6
                    val = this._createNamedVariable(new FunctionFormula("hd6", (shape) => shape.height / 6));
                    break;
                case "hd8":
                    // Height / 8
                    val = this._createNamedVariable(new FunctionFormula("hd8", (shape) => shape.height / 8));
                    break;
                case "w":
                    // Width
                    val = this._createNamedVariable(new FunctionFormula("w", (shape) => shape.width));
                    break;
                case "wd2":
                    // Width / 2
                    val = this._createNamedVariable(new FunctionFormula("wd2", (shape) => shape.width / 2));
                    break;
                case "wd3":
                    // Width / 3
                    val = this._createNamedVariable(new FunctionFormula("wd3", (shape) => shape.width / 3));
                    break;
                case "wd4":
                    // Width / 4
                    val = this._createNamedVariable(new FunctionFormula("wd4", (shape) => shape.width / 4));
                    break;
                case "wd5":
                    // Width / 5
                    val = this._createNamedVariable(new FunctionFormula("wd5", (shape) => shape.width / 5));
                    break;
                case "wd6":
                    // Width / 6
                    val = this._createNamedVariable(new FunctionFormula("wd6", (shape) => shape.width / 6));
                    break;
                case "wd8":
                    // Width / 8
                    val = this._createNamedVariable(new FunctionFormula("wd8", (shape) => shape.width / 8));
                    break;
                case "wd10":
                    // Width / 10
                    val = this._createNamedVariable(new FunctionFormula("wd10", (shape) => shape.width / 10));
                    break;
                case "cd2":
                    // 180 degrees or PI radians.
                    val = this._createNamedVariable(new FunctionFormula("cd2", (_shape) => Angle.fromNormalized(1 / 2).toRotation()));
                    break;
                case "cd4":
                    // 90 degrees or half PI radians.
                    val = this._createNamedVariable(new FunctionFormula("cd4", (_shape) => Angle.fromNormalized(1 / 4).toRotation()));
                    break;
                case "cd8":
                    // 45 degrees or quarter PI radians.
                    val = this._createNamedVariable(new FunctionFormula("cd8", (_shape) => Angle.fromNormalized(1 / 8).toRotation()));
                    break;
                case "3cd4":
                    // 270 degrees or 1.5 PI radians.
                    val = this._createNamedVariable(new FunctionFormula("3cd4", (_shape) => Angle.fromNormalized(3 / 4).toRotation()));
                    break;
                case "3cd8":
                    // 135 degrees or 3/4 PI radians.
                    val = this._createNamedVariable(new FunctionFormula("3cd8", (_shape) => Angle.fromNormalized(3 / 8).toRotation()));
                    break;
                case "5cd8":
                    // 225 degrees or 5/4 PI radians.
                    val = this._createNamedVariable(new FunctionFormula("5cd8", (_shape) => Angle.fromNormalized(5 / 8).toRotation()));
                    break;
                case "7cd8":
                    // 315 degrees or 7/4 PI radians.
                    val = this._createNamedVariable(new FunctionFormula("7cd8", (_shape) => Angle.fromNormalized(7 / 8).toRotation()));
                    break;
                case "hc":
                    // Horizontal center
                    val = this._createNamedVariable(new FunctionFormula("hc", (shape) => shape.width / 2));
                    break;
                case "vc":
                    // Vertical center
                    val = this._createNamedVariable(new FunctionFormula("vc", (shape) => shape.height / 2));
                    break;
                case "t":
                    // Top
                    val = this._createNamedVariable(new FunctionFormula("t", (_shape) => 0));
                    break;
                case "b":
                    // Bottom
                    val = this._createNamedVariable(new FunctionFormula("b", (shape) => shape.height));
                    break;
                case "r":
                    // Right
                    val = this._createNamedVariable(new FunctionFormula("r", (shape) => shape.width));
                    break;
                case "l":
                    // Left
                    val = this._createNamedVariable(new FunctionFormula("l", (_shape) => 0));
                    break;
                case "ss":
                    // Short Side
                    val = this._createNamedVariable(new FunctionFormula("ss", (shape) => Math.min(shape.width, shape.height)));
                    break;
                case "ssd2":
                    // Short Side / 2
                    val = this._createNamedVariable(new FunctionFormula("ssd2", (shape) => Math.min(shape.width, shape.height) / 2));
                    break;
                case "ssd3":
                    // Short Side / 3
                    val = this._createNamedVariable(new FunctionFormula("ssd3", (shape) => Math.min(shape.width, shape.height) / 3));
                    break;
                case "ssd4":
                    // Short Side / 4
                    val = this._createNamedVariable(new FunctionFormula("ssd4", (shape) => Math.min(shape.width, shape.height) / 4));
                    break;
                case "ssd6":
                    // Short Side / 6
                    val = this._createNamedVariable(new FunctionFormula("ssd6", (shape) => Math.min(shape.width, shape.height) / 6));
                    break;
                case "ssd8":
                    // Short Side / 8
                    val = this._createNamedVariable(new FunctionFormula("ssd8", (shape) => Math.min(shape.width, shape.height) / 8));
                    break;
                case "ssd16":
                    // Short Side / 8
                    val = this._createNamedVariable(new FunctionFormula("ssd16", (shape) => Math.min(shape.width, shape.height) / 16));
                    break;
                case "ssd32":
                    // Short Side / 32
                    val = this._createNamedVariable(new FunctionFormula("ssd32", (shape) => Math.min(shape.width, shape.height) / 32));
                    break;
                case "ls":
                    // Long Side
                    val = this._createNamedVariable(new FunctionFormula("ls", (shape) => Math.max(shape.width, shape.height)));
                    break;
                default:
                    const names = this._formulas.map(formula => formula.name).join(",");
                    console.log(`Unable to find variable ${name} in Shape Guide which defines variables: ${names}.`);
                    break;
            }
        }
        return (val !== undefined) ? val.val : Number.NaN;
    }
    _evaluateVariable(formula) {
        this._variables.push(this._createNamedVariable(formula));
    }
    _createNamedVariable(formula) {
        return { name: formula.name, val: formula.evaluate(this) };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcGUtZ3VpZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZHJhd2luZy9zaGFwZS1ndWlkZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFRbkQsTUFBTSxxQkFBcUI7SUFFdkIsWUFBbUIsSUFBWSxFQUFVLENBQVMsRUFBVSxDQUFTLEVBQVUsQ0FBUztRQUFyRSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVUsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUFVLE1BQUMsR0FBRCxDQUFDLENBQVE7UUFBVSxNQUFDLEdBQUQsQ0FBQyxDQUFRO0lBQ3hGLENBQUM7SUFFTSxRQUFRLENBQUMsS0FBaUI7UUFDN0IsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVNLFFBQVE7UUFDWCxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksUUFBUSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzVELENBQUM7Q0FDSjtBQUVELE1BQU0sa0JBQWtCO0lBRXBCLFlBQW1CLElBQVksRUFBVSxDQUFTLEVBQVUsQ0FBUyxFQUFVLENBQVM7UUFBckUsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFVLE1BQUMsR0FBRCxDQUFDLENBQVE7UUFBVSxNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQVUsTUFB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QUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRSxNQUFNO1lBQ1YsS0FBSyxJQUFJO2dCQUNMLElBQUksR0FBRyxJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0QsTUFBTTtZQUNWLEtBQUssS0FBSztnQkFDTixJQUFJLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxNQUFNO1lBQ1YsS0FBSyxLQUFLO2dCQUNOLElBQUksR0FBRyxJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuRCxNQUFNO1lBQ1YsS0FBSyxNQUFNO2dCQUNQLElBQUksR0FBRyxJQUFJLG1CQUFtQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuRSxNQUFNO1lBQ1YsS0FBSyxLQUFLO2dCQUNOLElBQUksR0FBRyxJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuRCxNQUFNO1lBQ1YsS0FBSyxLQUFLO2dCQUNOLElBQUksR0FBRyxJQUFJLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxNQUFNO1lBQ1YsS0FBSyxLQUFLO2dCQUNOLElBQUksR0FBRyxJQUFJLGNBQWMsQ0FBQyxJQUFJ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