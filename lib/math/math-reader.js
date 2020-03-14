import { Equation } from "./equation.js";
import { MathRun } from "./math-run.js";
import { RunStyle } from "../text/run-style.js";
import { NAryStyle } from "./n-ary-style.js";
import { MathObjectList } from "./math-object.js";
import { NAryObject } from "./n-ary-object.js";
import { DelimiterObject } from "./delimiter-object.js";
import { RunObject } from "./run-object.js";
import { DelimiterStyle } from "./delimiter-style.js";
import { Xml } from "../utils/xml.js";
import { FractionObject } from "./fraction-object.js";
import { FractionStyle } from "./fraction-style.js";
import { MatrixStyle, MatrixSpacingRule } from "./matrix-style.js";
import { MatrixObject } from "./matrix-object.js";
import { FunctionStyle } from "./function-style.js";
import { FunctionObject } from "./function-object.js";
import { RadicalStyle } from "./radical-style.js";
import { RadicalObject } from "./radical-object.js";
import { MatrixColumnStyle } from "./matrix-column-style.js";
import { Style } from "../text/style.js";
export class MathReader {
    static fromMathNode(mathNode) {
        const equation = new Equation(this._readMathElement(mathNode));
        return new MathRun(equation);
    }
    static _readNAryObject(naryNode) {
        let style = new NAryStyle();
        let sub = undefined;
        let sup = undefined;
        let elem = undefined;
        let grandChild = null;
        naryNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:naryPr":
                    style = this._readNAryStyle(child);
                    break;
                case "m:sub":
                    grandChild = child.firstChild;
                    if (grandChild !== null) {
                        sub = this._readMathElement(grandChild);
                    }
                    break;
                case "m:sup":
                    grandChild = child.firstChild;
                    if (grandChild !== null) {
                        sup = this._readMathElement(grandChild);
                    }
                    break;
                case "m:e":
                    elem = this._readMathElement(child);
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during N-Ary Object reading.`);
                    break;
            }
        });
        return new NAryObject(sub, sup, elem, style);
    }
    static _readNAryStyle(presentationNode) {
        const style = new NAryStyle();
        presentationNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:chr":
                    style.char = Xml.getStringValue(child) || "";
                    break;
                case "m:subHide":
                    style.hideSub = Xml.getBooleanValue(child) || false;
                    break;
                case "m:supHide":
                    style.hideSuper = Xml.getBooleanValue(child) || false;
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during N-Ary Style reading.`);
                    break;
            }
        });
        return style;
    }
    static _readDelimiterObject(delNode) {
        let style = new DelimiterStyle();
        let elem = undefined;
        delNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:dPr":
                    style = this._readDelimiterStyle(child);
                    break;
                case "m:e":
                    elem = this._readMathElement(child);
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Delimiter reading.`);
                    break;
            }
        });
        return new DelimiterObject(elem, style, new Style());
    }
    static _readDelimiterStyle(presentationNode) {
        const style = new DelimiterStyle();
        presentationNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:begChr":
                    style.beginChar = Xml.getStringValue(child) || "";
                    break;
                case "m:endChr":
                    style.endChar = Xml.getStringValue(child) || "";
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Delimiter style reading.`);
                    break;
            }
        });
        return style;
    }
    static _readFractionObject(fracNode) {
        let style = new FractionStyle();
        let numerator = undefined;
        let denumerator = undefined;
        fracNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:fPr":
                    style = this._readFractionStyle(child);
                    break;
                case "m:num":
                    numerator = this._readMathElement(child);
                    break;
                case "m:den":
                    denumerator = this._readMathElement(child);
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Fraction reading.`);
                    break;
            }
        });
        return new FractionObject(numerator, denumerator, style);
    }
    static _readFractionStyle(presentationNode) {
        const style = new FractionStyle();
        presentationNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:type":
                    style.setType(Xml.getStringValue(child));
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Delimiter style reading.`);
                    break;
            }
        });
        return style;
    }
    static _readFunctionObject(fracNode) {
        let style = new FunctionStyle();
        let functionName = undefined;
        let elem = undefined;
        fracNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:funcPr":
                    style = this._readFunctionStyle(child);
                    break;
                case "m:fName":
                    functionName = this._readMathElement(child);
                    break;
                case "m:e":
                    elem = this._readMathElement(child);
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Fraction reading.`);
                    break;
            }
        });
        return new FunctionObject(functionName, elem, style);
    }
    static _readFunctionStyle(presentationNode) {
        const style = new FunctionStyle();
        presentationNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:ctrlPr":
                    // Ignore for now.
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Delimiter style reading.`);
                    break;
            }
        });
        return style;
    }
    static _readMatrixObject(matrixNode) {
        let style = new MatrixStyle();
        let rows = new MathObjectList();
        matrixNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:mPr":
                    style = this._readMatrixStyle(child);
                    break;
                case "m:mr":
                    const row = new MathObjectList();
                    child.childNodes.forEach(grandChild => row.add(this._readMathElement(grandChild)));
                    rows.add(row);
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Fraction reading.`);
                    break;
            }
        });
        return new MatrixObject(rows, style);
    }
    static _readMatrixStyle(presentationNode) {
        const style = new MatrixStyle();
        presentationNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:baseJc":
                    style.setJustification(Xml.getStringValue(child));
                    break;
                case "m:plcHide":
                    style.hidePlaceholder = Xml.getBooleanValue(child) || false;
                    break;
                case "m:rSp":
                    style.rowSpacing = Xml.getNumberValue(child) || 1;
                    break;
                case "m:rSpRule":
                    style.rowSpacingRule = this._readMatrixSpacingRule(child);
                    break;
                case "m:cSp":
                    style.columnMinimalWidth = Xml.getNumberValue(child) || 0;
                    break;
                case "m:cGp":
                    style.columnGap = Xml.getNumberValue(child) || 1;
                    break;
                case "m:cGpRule":
                    style.columnGapRule = this._readMatrixSpacingRule(child);
                    break;
                case "m:mcs":
                    style.columnStyles = this._readMatrixColumnStyleList(child);
                    break;
                case "m:ctrlPr":
                    // Ignore for now.
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Delimiter style reading.`);
                    break;
            }
        });
        return style;
    }
    static _readMatrixSpacingRule(_ruleNode) {
        return MatrixSpacingRule.Single;
    }
    static _readMatrixColumnStyleList(columnsNode) {
        const columns = [];
        columnsNode.childNodes.forEach(child => {
            if (child.nodeName === "m:mc") {
                columns.push(this._readMatrixColumnStyle(child));
            }
        });
        return columns;
    }
    static _readMatrixColumnStyle(columnNode) {
        const style = new MatrixColumnStyle();
        columnNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:count":
                    style.count = Xml.getNumberValue(child) || 0;
                    break;
                case "m:mcJc":
                    style.setJustification(Xml.getStringValue(child));
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Matrix Column Style reading.`);
                    break;
            }
        });
        return style;
    }
    static _readRadicalObject(delNode) {
        let style = new RadicalStyle();
        let degree = undefined;
        let elem = undefined;
        delNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:radPr":
                    style = this._readRadicalStyle(child);
                    break;
                case "m:deg":
                    degree = this._readMathElement(child);
                    break;
                case "m:e":
                    elem = this._readMathElement(child);
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Radical reading.`);
                    break;
            }
        });
        return new RadicalObject(degree, elem, style);
    }
    static _readRadicalStyle(presentationNode) {
        const style = new RadicalStyle();
        presentationNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:degHide":
                    style.hideDegree = Xml.getBooleanValue(child) || false;
                    break;
                case "m:ctrlPr":
                    // Ignore for now.
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Delimiter style reading.`);
                    break;
            }
        });
        return style;
    }
    static _readRunObject(runNode) {
        let style = undefined;
        let text = "";
        runNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:t":
                    text = child.textContent || "";
                    break;
                case "w:rPr":
                    style = RunStyle.fromPresentationNode(child);
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Math Run reading.`);
                    break;
            }
        });
        return new RunObject(text, style || new RunStyle());
    }
    static _readMathElement(node) {
        const objects = new MathObjectList();
        node.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:e":
                    objects.add(this._readMathElement(child));
                    break;
                case "m:nary":
                    objects.add(this._readNAryObject(child));
                    break;
                case "m:d":
                    objects.add(this._readDelimiterObject(child));
                    break;
                case "m:r":
                    objects.add(this._readRunObject(child));
                    break;
                case "m:f":
                    objects.add(this._readFractionObject(child));
                    break;
                case "m:m":
                    objects.add(this._readMatrixObject(child));
                    break;
                case "m:func":
                    objects.add(this._readFunctionObject(child));
                    break;
                case "m:rad":
                    objects.add(this._readRadicalObject(child));
                    break;
                case "m:acc":
                case "m:bar":
                case "m:box":
                case "m:borderBox":
                case "m:eqArr":
                case "m:groupChr":
                case "m:limLow":
                case "m:limUpp":
                case "m:phant":
                case "m:sPre":
                case "m:sSub":
                case "m:sSubSup":
                case "m:sSup":
                    console.log(`Math Object ${child.nodeName} not implemented yet`);
                    break;
                default:
                    console.log(`Unknown node ${child.nodeName} encountered during reading of Math Objects`);
                    break;
            }
        });
        return objects;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0aC1yZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWF0aC9tYXRoLXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM3QyxPQUFPLEVBQWMsY0FBYyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDNUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzdELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUV6QyxNQUFNLE9BQU8sVUFBVTtJQUVaLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBYztRQUNyQyxNQUFNLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMvRCxPQUFPLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFTyxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQWM7UUFDekMsSUFBSSxLQUFLLEdBQWMsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUN2QyxJQUFJLEdBQUcsR0FBMkIsU0FBUyxDQUFDO1FBQzVDLElBQUksR0FBRyxHQUEyQixTQUFTLENBQUM7UUFDNUMsSUFBSSxJQUFJLEdBQTJCLFNBQVMsQ0FBQztRQUM3QyxJQUFJLFVBQVUsR0FBZ0IsSUFBSSxDQUFDO1FBQ25DLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2hDLFFBQVEsS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDcEIsS0FBSyxVQUFVO29CQUNYLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNuQyxNQUFNO2dCQUNWLEtBQUssT0FBTztvQkFDUixVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztvQkFDOUIsSUFBSSxVQUFVLEtBQUssSUFBSSxFQUFFO3dCQUNyQixHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO3FCQUMzQztvQkFDRCxNQUFNO2dCQUNWLEtBQUssT0FBTztvQkFDUixVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztvQkFDOUIsSUFBSSxVQUFVLEtBQUssSUFBSSxFQUFFO3dCQUNyQixHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO3FCQUMzQztvQkFDRCxNQUFNO2dCQUNWLEtBQUssS0FBSztvQkFDTixJQUFJLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNwQyxNQUFNO2dCQUNWO29CQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEtBQUssQ0FBQyxRQUFRLCtCQUErQixDQUFDLENBQUM7b0JBQ3RGLE1BQU07YUFDYjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxnQkFBc0I7UUFDaEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUM5QixnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3hDLFFBQVEsS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDcEIsS0FBSyxPQUFPO29CQUNSLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQzdDLE1BQU07Z0JBQ1YsS0FBSyxXQUFXO29CQUNaLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUM7b0JBQ3BELE1BQU07Z0JBQ1YsS0FBSyxXQUFXO29CQUNaLEtBQUssQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUM7b0JBQ3RELE1BQU07Z0JBQ1Y7b0JBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsS0FBSyxDQUFDLFFBQVEsOEJBQThCLENBQUMsQ0FBQztvQkFDckYsTUFBTTthQUNiO1FBQ0wsQ0FBQyxDQUFDLENBQUE7UUFDRixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU8sTUFBTSxDQUFDLG9CQUFvQixDQUFDLE9BQWE7UUFDN0MsSUFBSSxLQUFLLEdBQW1CLElBQUksY0FBYyxFQUFFLENBQUM7UUFDakQsSUFBSSxJQUFJLEdBQTJCLFNBQVMsQ0FBQztRQUM3QyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMvQixRQUFRLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ3BCLEtBQUssT0FBTztvQkFDUixLQUFLLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN4QyxNQUFNO2dCQUNWLEtBQUssS0FBSztvQkFDTixJQUFJLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNwQyxNQUFNO2dCQUNWO29CQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEtBQUssQ0FBQyxRQUFRLDRCQUE0QixDQUFDLENBQUM7b0JBQ25GLE1BQU07YUFDYjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRU8sTUFBTSxDQUFDLG1CQUFtQixDQUFDLGdCQUFzQjtRQUNyRCxNQUFNLEtBQUssR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQ25DLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDeEMsUUFBUSxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNwQixLQUFLLFVBQVU7b0JBQ1gsS0FBSyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDbEQsTUFBTTtnQkFDVixLQUFLLFVBQVU7b0JBQ1gsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDaEQsTUFBTTtnQkFDVjtvQkFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixLQUFLLENBQUMsUUFBUSxrQ0FBa0MsQ0FBQyxDQUFDO29CQUN6RixNQUFNO2FBQ2I7UUFDTCxDQUFDLENBQUMsQ0FBQTtRQUNGLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxNQUFNLENBQUMsbUJBQW1CLENBQUMsUUFBYztRQUM3QyxJQUFJLEtBQUssR0FBa0IsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUMvQyxJQUFJLFNBQVMsR0FBMkIsU0FBUyxDQUFDO1FBQ2xELElBQUksV0FBVyxHQUEyQixTQUFTLENBQUM7UUFDcEQsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDaEMsUUFBUSxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNwQixLQUFLLE9BQU87b0JBQ1IsS0FBSyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDdkMsTUFBTTtnQkFDVixLQUFLLE9BQU87b0JBQ1IsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekMsTUFBTTtnQkFDVixLQUFLLE9BQU87b0JBQ1IsV0FBVyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDM0MsTUFBTTtnQkFDVjtvQkFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixLQUFLLENBQUMsUUFBUSwyQkFBMkIsQ0FBQyxDQUFDO29CQUNsRixNQUFNO2FBQ2I7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxjQUFjLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRU8sTUFBTSxDQUFDLGtCQUFrQixDQUFDLGdCQUFzQjtRQUNwRCxNQUFNLEtBQUssR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ2xDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDeEMsUUFBUSxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNwQixLQUFLLFFBQVE7b0JBQ1QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3pDLE1BQU07Z0JBQ1Y7b0JBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsS0FBSyxDQUFDLFFBQVEsa0NBQWtDLENBQUMsQ0FBQztvQkFDekYsTUFBTTthQUNiO1FBQ0wsQ0FBQyxDQUFDLENBQUE7UUFDRixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU8sTUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQWM7UUFDN0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUNoQyxJQUFJLFlBQVksR0FBMkIsU0FBUyxDQUFDO1FBQ3JELElBQUksSUFBSSxHQUEyQixTQUFTLENBQUM7UUFDN0MsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDaEMsUUFBUSxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNwQixLQUFLLFVBQVU7b0JBQ1gsS0FBSyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDdkMsTUFBTTtnQkFDVixLQUFLLFNBQVM7b0JBQ1YsWUFBWSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDNUMsTUFBTTtnQkFDVixLQUFLLEtBQUs7b0JBQ04sSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDcEMsTUFBTTtnQkFDVjtvQkFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixLQUFLLENBQUMsUUFBUSwyQkFBMkIsQ0FBQyxDQUFDO29CQUNsRixNQUFNO2FBQ2I7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxjQUFjLENBQUMsWUFBWSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRU8sTUFBTSxDQUFDLGtCQUFrQixDQUFDLGdCQUFzQjtRQUNwRCxNQUFNLEtBQUssR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ2xDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDeEMsUUFBUSxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNwQixLQUFLLFVBQVU7b0JBQ1gsa0JBQWtCO29CQUNsQixNQUFNO2dCQUNWO29CQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEtBQUssQ0FBQyxRQUFRLGtDQUFrQyxDQUFDLENBQUM7b0JBQ3pGLE1BQU07YUFDYjtRQUNMLENBQUMsQ0FBQyxDQUFBO1FBQ0YsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVPLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFnQjtRQUM3QyxJQUFJLEtBQUssR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQzlCLElBQUksSUFBSSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDaEMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDbEMsUUFBUSxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNwQixLQUFLLE9BQU87b0JBQ1IsS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDckMsTUFBTTtnQkFDVixLQUFLLE1BQU07b0JBQ1AsTUFBTSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztvQkFDakMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FDbEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FDN0MsQ0FBQztvQkFDRixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNkLE1BQU07Z0JBQ1Y7b0JBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsS0FBSyxDQUFDLFFBQVEsMkJBQTJCLENBQUMsQ0FBQztvQkFDbEYsTUFBTTthQUNiO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU8sTUFBTSxDQUFDLGdCQUFnQixDQUFDLGdCQUFzQjtRQUNsRCxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ2hDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDeEMsUUFBUSxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNwQixLQUFLLFVBQVU7b0JBQ1gsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDbEQsTUFBTTtnQkFDVixLQUFLLFdBQVc7b0JBQ1osS0FBSyxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQztvQkFDNUQsTUFBTTtnQkFDVixLQUFLLE9BQU87b0JBQ1IsS0FBSyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDbEQsTUFBTTtnQkFDVixLQUFLLFdBQVc7b0JBQ1osS0FBSyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzFELE1BQU07Z0JBQ1YsS0FBSyxPQUFPO29CQUNSLEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDMUQsTUFBTTtnQkFDVixLQUFLLE9BQU87b0JBQ1IsS0FBSyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDakQsTUFBTTtnQkFDVixLQUFLLFdBQVc7b0JBQ1osS0FBSyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pELE1BQU07Z0JBQ1YsS0FBSyxPQUFPO29CQUNSLEtBQUssQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM1RCxNQUFNO2dCQUNWLEtBQUssVUFBVTtvQkFDWCxrQkFBa0I7b0JBQ2xCLE1BQU07Z0JBQ1Y7b0JBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsS0FBSyxDQUFDLFFBQVEsa0NBQWtDLENBQUMsQ0FBQztvQkFDekYsTUFBTTthQUNiO1FBQ0wsQ0FBQyxDQUFDLENBQUE7UUFDRixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU8sTUFBTSxDQUFDLHNCQUFzQixDQUFDLFNBQWU7UUFDakQsT0FBTyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7SUFDcEMsQ0FBQztJQUVPLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxXQUFpQjtRQUN2RCxNQUFNLE9BQU8sR0FBd0IsRUFBRSxDQUFDO1FBQ3hDLFdBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ25DLElBQUksS0FBSyxDQUFDLFFBQVEsS0FBSyxNQUFNLEVBQUU7Z0JBQzNCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDcEQ7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFTyxNQUFNLENBQUMsc0JBQXNCLENBQUMsVUFBZ0I7UUFDbEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO1FBQ3RDLFVBQVUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2xDLFFBQVEsS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDcEIsS0FBSyxTQUFTO29CQUNWLEtBQUssQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzdDLE1BQU07Z0JBQ1YsS0FBSyxRQUFRO29CQUNULEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2xELE1BQU07Z0JBQ1Y7b0JBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsS0FBSyxDQUFDLFFBQVEsc0NBQXNDLENBQUMsQ0FBQztvQkFDN0YsTUFBTTthQUNiO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU8sTUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQWE7UUFDM0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMvQixJQUFJLE1BQU0sR0FBMkIsU0FBUyxDQUFDO1FBQy9DLElBQUksSUFBSSxHQUEyQixTQUFTLENBQUM7UUFDN0MsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDL0IsUUFBUSxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNwQixLQUFLLFNBQVM7b0JBQ1YsS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDdEMsTUFBTTtnQkFDVixLQUFLLE9BQU87b0JBQ1IsTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDdEMsTUFBTTtnQkFDVixLQUFLLEtBQUs7b0JBQ04sSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDcEMsTUFBTTtnQkFDVjtvQkFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixLQUFLLENBQUMsUUFBUSwwQkFBMEIsQ0FBQyxDQUFDO29CQUNqRixNQUFNO2FBQ2I7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRU8sTUFBTSxDQUFDLGlCQUFpQixDQUFDLGdCQUFzQjtRQUNuRCxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDeEMsUUFBUSxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNwQixLQUFLLFdBQVc7b0JBQ1osS0FBSyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQztvQkFDdkQsTUFBTTtnQkFDVixLQUFLLFVBQVU7b0JBQ1gsa0JBQWtCO29CQUNsQixNQUFNO2dCQUNWO29CQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEtBQUssQ0FBQyxRQUFRLGtDQUFrQyxDQUFDLENBQUM7b0JBQ3pGLE1BQU07YUFDYjtRQUNMLENBQUMsQ0FBQyxDQUFBO1FBQ0YsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVPLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBYTtRQUN2QyxJQUFJLEtBQUssR0FBeUIsU0FBUyxDQUFDO1FBQzVDLElBQUksSUFBSSxHQUFXLEVBQUUsQ0FBQztRQUN0QixPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMvQixRQUFRLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ3BCLEtBQUssS0FBSztvQkFDTixJQUFJLEdBQUcsS0FBSyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7b0JBQy9CLE1BQU07Z0JBQ1YsS0FBSyxPQUFPO29CQUNSLEtBQUssR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzdDLE1BQU07Z0JBQ1Y7b0JBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsS0FBSyxDQUFDLFFBQVEsMkJBQTJCLENBQUMsQ0FBQztvQkFDbEYsTUFBTTthQUNiO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLElBQUksSUFBSSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBVTtRQUN0QyxNQUFNLE9BQU8sR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzVCLFFBQVEsS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDcEIsS0FBSyxLQUFLO29CQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQzFDLE1BQU07Z0JBQ1YsS0FBSyxRQUFRO29CQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN6QyxNQUFNO2dCQUNWLEtBQUssS0FBSztvQkFDTixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUM5QyxNQUFNO2dCQUNWLEtBQUssS0FBSztvQkFDTixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDeEMsTUFBTTtnQkFDVixLQUFLLEtBQUs7b0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDN0MsTUFBTTtnQkFDVixLQUFLLEtBQUs7b0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsTUFBTTtnQkFDVixLQUFLLFFBQVE7b0JBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDN0MsTUFBTTtnQkFDVixLQUFLLE9BQU87b0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDNUMsTUFBTTtnQkFDVixLQUFLLE9BQU8sQ0FBQztnQkFDYixLQUFLLE9BQU8sQ0FBQztnQkFDYixLQUFLLE9BQU8sQ0FBQztnQkFDYixLQUFLLGFBQWEsQ0FBQztnQkFDbkIsS0FBSyxTQUFTLENBQUM7Z0JBQ2YsS0FBSyxZQUFZLENBQUM7Z0JBQ2xCLEtBQUssVUFBVSxDQUFDO2dCQUNoQixLQUFLLFVBQVUsQ0FBQztnQkFDaEIsS0FBSyxTQUFTLENBQUM7Z0JBQ2YsS0FBSyxRQUFRLENBQUM7Z0JBQ2QsS0FBSyxRQUFRLENBQUM7Z0JBQ2QsS0FBSyxXQUFXLENBQUM7Z0JBQ2pCLEtBQUssUUFBUTtvQkFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsS0FBSyxDQUFDLFFBQVEsc0JBQXNCLENBQUMsQ0FBQztvQkFDakUsTUFBTTtnQkFDVjtvQkFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixLQUFLLENBQUMsUUFBUSw2Q0FBNkMsQ0FBQyxDQUFDO29CQUN6RixNQUFNO2FBQ2I7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7Q0FDSiJ9