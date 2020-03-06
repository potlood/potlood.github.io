export class CoreProperties {
    constructor() {
        this.creator = undefined;
        this.created = undefined;
        this.description = undefined;
        this.language = undefined;
        this.lastModifiedBy = undefined;
        this.lastModified = undefined;
        this.lastPrinted = undefined;
        this.revision = undefined;
        this.subject = undefined;
        this.title = undefined;
        this.keywords = undefined;
    }
    static fromDocument(doc) {
        const coreProperties = new CoreProperties();
        doc.getRootNode().childNodes.forEach(propsNode => {
            propsNode.childNodes.forEach(propNode => {
                const text = (propNode.textContent === null) ? "" : propNode.textContent;
                switch (propNode.nodeName) {
                    case "dcterms:created":
                        coreProperties.created = CoreProperties._parseDateString(text);
                        break;
                    case "dc:creator":
                        coreProperties.creator = text;
                        break;
                    case "dc:description":
                        coreProperties.description = text;
                        break;
                    case "dc:language":
                        coreProperties.language = text;
                        break;
                    case "cp:lastModifiedBy":
                        coreProperties.lastModifiedBy = text;
                        break;
                    case "dcterms:modified":
                        coreProperties.lastModified = CoreProperties._parseDateString(text);
                        break;
                    case "cp:lastPrinted":
                        coreProperties.lastPrinted = CoreProperties._parseDateString(text);
                        break;
                    case "cp:revision":
                        coreProperties.revision = parseInt(text);
                        break;
                    case "dc:subject":
                        coreProperties.subject = text;
                        break;
                    case "dc:title":
                        coreProperties.title = text;
                        break;
                    case "cp:keywords":
                        coreProperties.keywords = text;
                        break;
                    default:
                        console.log(`Unknown core property ${propNode.nodeName} encountered during reading.`);
                        break;
                }
            });
        });
        return coreProperties;
    }
    static _parseDateString(text) {
        // Expecting formats: 
        // YYYY
        // YYYY-MM
        // YYYY-MM-DD
        // YYYY-MM-DDThh:mmZ
        // YYYY-MM-DDThh:mm:ssZ
        // YYYY-MM-DDThh:mm:ss.sZ
        // Where T is literal and Z can be literal Z or a time zone offset (+hh:mm or -hh:mm).
        const year = parseInt(text.substr(0, 4));
        const month = (text.length <= 4) ? 0 : parseInt(text.substr(5, 2));
        const day = (text.length <= 7) ? 0 : parseInt(text.substr(8, 2));
        let hour = 0;
        let min = 0;
        let sec = 0;
        const milli = 0;
        if (text.length > 10) {
            hour = parseInt(text.substr(11, 2));
            min = parseInt(text.substr(14, 2));
            sec = parseInt(text.substr(17, 2));
        }
        return new Date(Date.UTC(year, month - 1, day, hour, min, sec, milli));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS1wcm9wZXJ0aWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZpZWxkcy9jb3JlLXByb3BlcnRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsTUFBTSxPQUFPLGNBQWM7SUFBM0I7UUFDVyxZQUFPLEdBQXVCLFNBQVMsQ0FBQztRQUN4QyxZQUFPLEdBQXFCLFNBQVMsQ0FBQztRQUN0QyxnQkFBVyxHQUF1QixTQUFTLENBQUM7UUFDNUMsYUFBUSxHQUF1QixTQUFTLENBQUM7UUFDekMsbUJBQWMsR0FBdUIsU0FBUyxDQUFDO1FBQy9DLGlCQUFZLEdBQXFCLFNBQVMsQ0FBQztRQUMzQyxnQkFBVyxHQUFxQixTQUFTLENBQUM7UUFDMUMsYUFBUSxHQUF1QixTQUFTLENBQUM7UUFDekMsWUFBTyxHQUF1QixTQUFTLENBQUM7UUFDeEMsVUFBSyxHQUF1QixTQUFTLENBQUM7UUFDdEMsYUFBUSxHQUF1QixTQUFTLENBQUM7SUF5RXBELENBQUM7SUF2RVUsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFnQjtRQUN2QyxNQUFNLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQzVDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzdDLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNwQyxNQUFNLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztnQkFDekUsUUFBUSxRQUFRLENBQUMsUUFBUSxFQUFFO29CQUN2QixLQUFLLGlCQUFpQjt3QkFDbEIsY0FBYyxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQy9ELE1BQU07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