import { Xml } from "../utils/xml.js";
import { Style } from "./style.js";
import { TextRun } from "./text-run.js";
import { RunStyle } from "./run-style.js";
export class TextReader {
    static readTextRun(runNode, parStyle, namedStyles) {
        const run = new TextRun([], new Style());
        const presentationNode = Xml.getFirstChildOfName(runNode, "w:rPr");
        if (presentationNode !== undefined && presentationNode.hasChildNodes()) {
            run.style.runStyle = RunStyle.fromPresentationNode(presentationNode);
        }
        if (parStyle !== undefined) {
            run.style.parStyle = parStyle;
        }
        run.texts = TextReader._getTexts(runNode);
        run.style.applyNamedStyles(namedStyles);
        return run;
    }
    static _getTexts(runNode) {
        const texts = [];
        if (runNode.hasChildNodes()) {
            runNode.childNodes.forEach((node) => {
                switch (node.nodeName) {
                    case "w:t":
                        const content = node.textContent;
                        if (content !== null) {
                            texts.push(content);
                        }
                        break;
                    case "w:br":
                    case "w:cr":
                        texts.push(" \n ");
                        break;
                    default:
                        // Ignore all other nodes
                        break;
                }
            });
        }
        return texts;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1yZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGV4dC90ZXh0LXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdEMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUkxQyxNQUFNLE9BQU8sVUFBVTtJQUNaLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBa0IsRUFBRSxRQUE4QixFQUFFLFdBQW9DO1FBQzlHLE1BQU0sR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDekMsTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ25FLElBQUksZ0JBQWdCLEtBQUssU0FBUyxJQUFJLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxFQUFFO1lBQ3BFLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ3hFO1FBQ0QsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQ3hCLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztTQUNqQztRQUNELEdBQUcsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQyxHQUFHLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVPLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBa0I7UUFDdkMsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO1FBQzNCLElBQUksT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFO1lBQ3pCLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ2hDLFFBQU8sSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDbEIsS0FBSyxLQUFLO3dCQUNOLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7d0JBQ2pDLElBQUksT0FBTyxLQUFLLElBQUksRUFBRTs0QkFDbEIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzt5QkFDdkI7d0JBQ0QsTUFBTTtvQkFDVixLQUFLLE1BQU0sQ0FBQztvQkFDWixLQUFLLE1BQU07d0JBQ1AsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDbkIsTUFBTTtvQkFDVjt3QkFDSSx5QkFBeUI7d0JBQ3pCLE1BQU07aUJBQ2I7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNOO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztDQUNKIn0=