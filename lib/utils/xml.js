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
        if (!Array.isArray(name)) {
            return this.getFirstChildOfName(parent, [name]);
        }
        let child = undefined;
        const children = parent.childNodes;
        for (let i = 0; i < children.length; i++) {
            if (name.indexOf(children[i].nodeName) !== -1) {
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
        let attr = Xml.getAttribute(node, "w:val");
        if (attr !== undefined) {
            val = attr;
        }
        else {
            attr = Xml.getAttribute(node, "val");
            if (attr !== undefined) {
                val = attr;
            }
            else {
                attr = Xml.getAttribute(node, "m:val");
                if (attr !== undefined) {
                    val = attr;
                }
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