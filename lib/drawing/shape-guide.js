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
        const y = guide.getValue(this.y);
        return x * Math.cos(y);
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
        const y = guide.getValue(this.y);
        return x * Math.sin(y);
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
        const isNumber = /^(\d|-)/.test(statement);
        if (isNumber) {
            val = parseFloat(statement);
        }
        else {
            val = this._getVariableValue(statement);
        }
        return val;
    }
    evaluate() {
        this._formulas.forEach(formula => {
            this._evaluateVariable(formula);
        });
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
                    val = this._createNamedVariable(new FunctionFormula("cd2", (_shape) => Math.PI));
                    break;
                case "cd4":
                    // 90 degrees or half PI radians.
                    val = this._createNamedVariable(new FunctionFormula("cd4", (_shape) => Math.PI / 2));
                    break;
                case "cd8":
                    // 45 degrees or quarter PI radians.
                    val = this._createNamedVariable(new FunctionFormula("cd8", (_shape) => Math.PI / 4));
                    break;
                case "3cd4":
                    // 270 degrees or 1.5 PI radians.
                    val = this._createNamedVariable(new FunctionFormula("3cd4", (_shape) => 3 * Math.PI / 2));
                    break;
                case "3cd8":
                    // 135 degrees or 3/4 PI radians.
                    val = this._createNamedVariable(new FunctionFormula("3cd8", (_shape) => 3 * Math.PI / 4));
                    break;
                case "5cd8":
                    // 225 degrees or 5/4 PI radians.
                    val = this._createNamedVariable(new FunctionFormula("5cd8", (_shape) => 5 * Math.PI / 4));
                    break;
                case "7cd8":
                    // 315 degrees or 7/4 PI radians.
                    val = this._createNamedVariable(new FunctionFormula("7cd8", (_shape) => 7 * Math.PI / 4));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcGUtZ3VpZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZHJhd2luZy9zaGFwZS1ndWlkZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxNQUFNLHFCQUFxQjtJQUV2QixZQUFtQixJQUFZLEVBQVUsQ0FBUyxFQUFVLENBQVMsRUFBVSxDQUFTO1FBQXJFLFNBQUksR0FBSixJQUFJLENBQVE7UUFBVSxNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQVUsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUFVLE1BQUMsR0FBRCxDQUFDLENBQVE7SUFDeEYsQ0FBQztJQUVNLFFBQVEsQ0FBQyxLQUFpQjtRQUM3QixNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRU0sUUFBUTtRQUNYLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxRQUFRLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDNUQsQ0FBQztDQUNKO0FBRUQsTUFBTSxrQkFBa0I7SUFFcEIsWUFBbUIsSUFBWSxFQUFVLENBQVMsRUFBVSxDQUFTLEVBQVUsQ0FBUztRQUFyRSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVUsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUFVLE1BQUMsR0FBRCxDQUFDLENBQVE7UUFBVSxNQUFDLEdBQUQsQ0FBQyxDQUFRO0lBQ3hGLENBQUM7SUFFTSxRQUFRLENBQUMs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