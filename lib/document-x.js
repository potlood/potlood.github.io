import { Xml } from "./utils/xml.js";
import { Section } from "./section.js";
import { TableReader } from "./table/table-reader.js";
import { ParagraphReader } from "./paragraph/paragraph-reader.js";
export class DocumentX {
    constructor(pack, part) {
        this.pars = [];
        this.pack = pack;
        this.part = part;
    }
    parseContent() {
        if (this.pars.length === 0) {
            const doc = Xml.getFirstChildOfName(this.part.document, "w:document");
            if (doc !== undefined) {
                const body = Xml.getFirstChildOfName(doc, "w:body");
                if (body !== undefined) {
                    body.childNodes.forEach(node => {
                        switch (node.nodeName) {
                            case "w:p":
                                this.pars.push(ParagraphReader.readParagraph(this, node));
                                break;
                            case "w:tbl":
                                this.pars.push(TableReader.readTable(this, node));
                                break;
                            case "w:sectPr":
                                this._section = new Section(this, node);
                                break;
                            case "w:sdt":
                                const sdtPars = ParagraphReader.readStructuredDocumentTag(this, node);
                                this.pars.push(...sdtPars);
                                break;
                            default:
                                console.log(`Don't know how to parse ${node.nodeName} during Document reading.`);
                                break;
                        }
                    });
                }
            }
        }
    }
    performLayout(flow) {
        this.parseContent();
        this.pars.forEach(par => {
            par.performLayout(flow);
        });
    }
    get relationships() {
        return this._rels;
    }
    get styles() {
        return this._styles;
    }
    get numberings() {
        return this._numberings;
    }
    get coreProperties() {
        return this._coreProperties;
    }
    setRelationships(relationships) {
        this._rels = relationships;
    }
    setNamedStyles(styles) {
        this._styles = styles;
    }
    setNumberings(numberings) {
        this._numberings = numberings;
    }
    setCoreProperties(coreProperties) {
        this._coreProperties = coreProperties;
    }
    get paragraphs() {
        return this.pars;
    }
    get section() {
        return this._section;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jdW1lbnQteC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kb2N1bWVudC14LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUdyQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBT3ZDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFHbEUsTUFBTSxPQUFPLFNBQVM7SUFXbEIsWUFBWSxJQUFhLEVBQUUsSUFBYTtRQVRoQyxTQUFJLEdBQTBCLEVBQUUsQ0FBQztRQVVyQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sWUFBWTtRQUNmLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3hCLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUN0RSxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7Z0JBQ25CLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3BELElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtvQkFDcEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQzNCLFFBQU8sSUFBSSxDQUFDLFFBQVEsRUFBRTs0QkFDbEIsS0FBSyxLQUFLO2dDQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7Z0NBQzFELE1BQU07NEJBQ1YsS0FBSyxPQUFPO2dDQUNSLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7Z0NBQ2xELE1BQU07NEJBQ1YsS0FBSyxVQUFVO2dDQUNYLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dDQUN4QyxNQUFNOzRCQUNWLEtBQUssT0FBTztnQ0FDUixNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMseUJBQXlCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dDQUN0RSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO2dDQUMzQixNQUFNOzRCQUNWO2dDQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLElBQUksQ0FBQyxRQUFRLDJCQUEyQixDQUFDLENBQUM7Z0NBQ2pGLE1BQU07eUJBQ2I7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7aUJBQ047YUFDSjtTQUNKO0lBQ0wsQ0FBQztJQUVNLGFBQWEsQ0FBQyxJQUFpQjtRQUNsQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDcEIsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxJQUFXLGFBQWE7UUFDcEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFXLE1BQU07UUFDYixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDeEIsQ0FBQztJQUVELElBQVcsVUFBVTtRQUNqQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQVcsY0FBYztRQUNyQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDaEMsQ0FBQztJQUVNLGdCQUFnQixDQUFDLGFBQTRCO1FBQ2hELElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDO0lBQy9CLENBQUM7SUFFTSxjQUFjLENBQUMsTUFBbUI7UUFDckMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDMUIsQ0FBQztJQUVNLGFBQWEsQ0FBQyxVQUE4QjtRQUMvQyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBRU0saUJBQWlCLENBQUMsY0FBOEI7UUFDbkQsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7SUFDMUMsQ0FBQztJQUVELElBQVcsVUFBVTtRQUNqQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVELElBQVcsT0FBTztRQUNkLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0NBQ0oifQ==