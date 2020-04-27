import { Xml } from "../utils/xml.js";
export class Picture {
    constructor(pack, name) {
        this._pack = pack;
        this._name = name;
    }
    static fromPicNode(picNode, docx) {
        let run = undefined;
        const blipFill = Xml.getFirstChildOfName(picNode, "pic:blipFill");
        if (blipFill !== undefined) {
            const blip = Xml.getFirstChildOfName(blipFill, "a:blip");
            if (blip !== undefined) {
                const relId = Xml.getAttribute(blip, "r:embed");
                let target = undefined;
                if (docx.relationships !== undefined && relId !== undefined) {
                    target = docx.relationships.getTarget(relId);
                    run = new Picture(docx.pack, `word/${target}`);
                }
            }
        }
        return run;
    }
    getImageUrl() {
        return new Promise((resolve, reject) => {
            if (this._imageUrl !== undefined) {
                resolve(this._imageUrl);
            }
            else {
                const fileParts = this._name.split('.');
                const fileExtension = fileParts[fileParts.length - 1];
                let binaryProc = undefined;
                let mimeType = undefined;
                switch (fileExtension) {
                    case "jpg":
                    case "jpeg":
                        mimeType = 'image/jpeg';
                        break;
                    case "png":
                        mimeType = 'image/png';
                        break;
                    case "gif":
                        mimeType = 'image/gif';
                        break;
                    case "bmp":
                        mimeType = 'image/bmp';
                        break;
                    case "webp":
                        mimeType = 'image/webp';
                        break;
                    case "tif":
                    case "tiff":
                        if (this._hasTiffSupport) {
                            binaryProc = this._getImageUrlForTiff;
                        }
                        break;
                    case "wmf":
                        if (this._hasWmfSupport) {
                            binaryProc = this._getImageUrlForWmf;
                        }
                        break;
                    case "wmz":
                        // TODO: Implement decompression to WMF
                        break;
                    case "emf":
                        if (this._hasEmfSupport) {
                            binaryProc = this._getImageUrlForEmf;
                        }
                        break;
                    case "emz":
                        // TODO: Implement decompression to EMF
                        break;
                }
                if (mimeType !== undefined) {
                    this._pack.loadPartAsBase64(this._name).then(content => {
                        this._imageUrl = `data:${mimeType};base64,${content}`;
                        resolve(this._imageUrl);
                    }).catch(error => {
                        reject(error);
                    });
                }
                else if (binaryProc !== undefined && this.bounds !== undefined) {
                    const bounds = this.bounds;
                    this._pack.loadPartAsBinary(this._name).then(buffer => {
                        binaryProc(buffer, bounds).then((url) => {
                            this._imageUrl = url;
                            resolve(this._imageUrl);
                        }).catch((err) => {
                            reject(err);
                        });
                    });
                }
            }
        });
    }
    performLayout(_flow) {
    }
    get _hasTiffSupport() {
        return UTIF !== undefined;
    }
    _getImageUrlForTiff(buffer, _bounds) {
        return new Promise((resolve, reject) => {
            const ifds = UTIF.decode(buffer);
            let vsns = ifds;
            let ma = 0;
            let page = vsns[0];
            if (ifds[0].subIFD) {
                vsns = vsns.concat(ifds[0].subIFD);
            }
            for (let i = 0; i < vsns.length; i++) {
                const img = vsns[i];
                if (img["t258"] === null || img["t258"].length < 3) {
                    continue;
                }
                const ar = img["t256"] * img["t257"];
                if (ar > ma) {
                    ma = ar;
                    page = img;
                }
            }
            UTIF.decodeImage(buffer, page, ifds);
            const rgba = UTIF.toRGBA8(page);
            const width = page.width;
            const height = page.height;
            const ind = 0; // TODO: Should we check for index??
            UTIF._xhrs.splice(ind, 1);
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext("2d");
            if (context !== null) {
                const imgd = context.createImageData(width, height);
                for (let i = 0; i < rgba.length; i++) {
                    imgd.data[i] = rgba[i];
                }
                context.putImageData(imgd, 0, 0);
                resolve(canvas.toDataURL());
            }
            else {
                reject("Unable to create offscreen Canvas element");
            }
        });
    }
    get _hasEmfSupport() {
        return EMFJS !== undefined;
    }
    _getImageUrlForEmf(buffer, bounds) {
        return new Promise((resolve, reject) => {
            EMFJS.loggingEnabled(false);
            const renderer = new EMFJS.Renderer(buffer);
            const width = bounds.width;
            const height = bounds.height;
            const settings = {
                width: width + "pt",
                height: height + "pt",
                xExt: width,
                yExt: height,
                mapMode: 8
            };
            const result = renderer.render(settings);
            if (result !== undefined) {
                resolve(result);
            }
            else {
                reject("Error during WMF parsing.");
            }
        });
    }
    get _hasWmfSupport() {
        return WMFJS !== undefined;
    }
    _getImageUrlForWmf(buffer, bounds) {
        return new Promise((resolve, reject) => {
            WMFJS.loggingEnabled(false);
            const renderer = new WMFJS.Renderer(buffer);
            const width = bounds.width;
            const height = bounds.height;
            const settings = {
                width: width + "pt",
                height: height + "pt",
                xExt: width,
                yExt: height,
                mapMode: 8
            };
            const result = renderer.render(settings);
            if (result !== undefined) {
                resolve(result);
            }
            else {
                reject("Error during WMF parsing.");
            }
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGljdHVyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kcmF3aW5nL3BpY3R1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBU3RDLE1BQU0sT0FBTyxPQUFPO0lBdUJoQixZQUFZLElBQWEsRUFBRSxJQUFZO1FBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLENBQUM7SUFwQk0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFrQixFQUFFLElBQWU7UUFDekQsSUFBSSxHQUFHLEdBQXdCLFNBQVMsQ0FBQztRQUN6QyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUN4QixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3pELElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtnQkFDcEIsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ2hELElBQUksTUFBTSxHQUF1QixTQUFTLENBQUM7Z0JBQzNDLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtvQkFDekQsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM3QyxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLE1BQU0sRUFBRSxDQUFDLENBQUM7aUJBQ2xEO2FBQ0o7U0FDSjtRQUNELE9BQU8sR0FBRyxDQUFD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