export class Xml {
    static loadFromUrl(url) {
        return new Promise((resolve, reject) => {
            var oReq = new XMLHttpRequest();
            oReq.open("GET", url, true);
            oReq.responseType = "text";
            oReq.onload = (_oEvent) => {
                if (oReq.status === 200) {
                    var text = oReq.response;
                    const doc = new DOMParser().parseFromString(text, "application/xml");
                    resolve(doc);
                }
                else {
                    reject(`File not found: ${url}`);
                }
            };
            oReq.onerror = (evt) => {
                reject(evt);
            };
            oReq.send(null);
        });
    }
    /**
     * Get the value of the attribute.
     * @param node Node to get the attribute from.
     * @param name Name of the attribute to get from the node.
     */
    static getAttribute(node, name) {
        let val = undefined;
        const element = node;
        const attrVal = element.getAttribute(name);
        if (attrVal !== null) {
            val = attrVal;
        }
        return val;
    }
    /**
     * Get first of the direct child nodes which have nodeName equal to name.
     * @param parent The node under which to search for nodes.
     * @param name  The node name to search for.
     */
    static getFirstChildOfName(parent, name) {
        let child = undefined;
        const children = parent.childNodes;
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName === name) {
                child = children[i];
                break;
            }
        }
        return child;
    }
    /**
     * Get the "w:val" attribute as string, from the node.
     */
    static getStringValue(node) {
        let val = undefined;
        const attr = Xml.getAttribute(node, "w:val");
        if (attr !== undefined) {
            val = attr;
        }
        else {
            const attr = Xml.getAttribute(node, "val");
            if (attr !== undefined) {
                val = attr;
            }
        }
        return val;
    }
    /**
     * Get the "w:val" attribute as string, from the child node with the specified name.
     */
    static getStringValueFromNode(parent, name) {
        let val = undefined;
        const child = Xml.getFirstChildOfName(parent, name);
        if (child !== undefined) {
            val = Xml.getStringValue(child);
        }
        return val;
    }
    /**
     * Get the "w:val" attribute as boolean, from the node.
     */
    static getBooleanValue(node) {
        let val = undefined;
        const attr = Xml.getStringValue(node);
        if (attr !== undefined) {
            val = Xml.attributeAsBoolean(attr);
        }
        else {
            // Absence of w:val means true
            val = true;
        }
        return val;
    }
    /**
     * Get the "w:val" attribute as boolean, from the child node with the specified name.
     */
    static getBooleanValueFromNode(parent, name) {
        let val = undefined;
        const child = Xml.getFirstChildOfName(parent, name);
        if (child !== undefined) {
            val = Xml.getBooleanValue(child);
        }
        return val;
    }
    /**
     * Get the "w:val" attribute as boolean, from the node.
     */
    static getNumberValue(node) {
        let val = undefined;
        const attr = Xml.getStringValue(node);
        if (attr !== undefined) {
            val = parseFloat(attr);
        }
        return val;
    }
    /**
     * Get the "w:val" attribute as boolean, from the child node with the specified name.
     */
    static getNumberValueFromNode(parent, name) {
        let val = undefined;
        const child = Xml.getFirstChildOfName(parent, name);
        if (child !== undefined) {
            val = Xml.getNumberValue(child);
        }
        return val;
    }
    /**
     * Interprets the attribute value as boolean.
     */
    static attributeAsBoolean(attr) {
        return (attr === 'true') || (attr === '1');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL3htbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLE9BQU8sR0FBRztJQUVMLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBVztRQUNqQyxPQUFPLElBQUksT0FBTyxDQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQzdDLElBQUksSUFBSSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7WUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO1lBRTNCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDdEIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtvQkFDckIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQWtCLENBQUM7b0JBQ25DLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO29CQUNyRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2hCO3FCQUFNO29CQUNILE1BQU0sQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLENBQUMsQ0FBQztpQkFDcEM7WUFDTCxDQUFDLENBQUM7WUFDRixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ25CLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoQixDQUFDLENBQUE7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQVUsRUFBRSxJQUFZO1FBQy9DLElBQUks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