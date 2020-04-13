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
                if (this.isJpeg) {
                    this._getImageUrlForJpeg().then(() => {
                        resolve(this._imageUrl);
                    }).catch((err) => {
                        reject(err);
                    });
                }
                else if (this.isPng) {
                    this._getImageUrlForPng().then(() => {
                        resolve(this._imageUrl);
                    }).catch((err) => {
                        reject(err);
                    });
                }
                else if (this.isTiff) {
                    this._getImageUrlForTiff().then(() => {
                        resolve(this._imageUrl);
                    }).catch((err) => {
                        reject(err);
                    });
                }
                else if (this.isWmf) {
                    this._getImageUrlForWmf().then(() => {
                        resolve(this._imageUrl);
                    }).catch((err) => {
                        reject(err);
                    });
                }
                else if (this.isEmf) {
                    this._getImageUrlForEmf().then(() => {
                        resolve(this._imageUrl);
                    }).catch((err) => {
                        reject(err);
                    });
                }
                else {
                    reject(`Unknown image at: ${this._name}`);
                }
            }
        });
    }
    get isJpeg() {
        return this._name.endsWith('.jpg') || this._name.endsWith('.jpeg');
    }
    get isPng() {
        return this._name.endsWith('.png');
    }
    get isTiff() {
        return this._name.endsWith('.tif') || this._name.endsWith('.tiff');
    }
    get isWmf() {
        return this._name.endsWith('.wmf');
    }
    get isEmf() {
        return this._name.endsWith('.emf');
    }
    performLayout(_flow) {
    }
    _getImageUrlForJpeg() {
        return new Promise((resolve, reject) => {
            this._pack.loadPartAsBase64(this._name).then(content => {
                const mimeType = 'image/jpeg';
                this._imageUrl = `data:${mimeType};base64,${content}`;
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    }
    _getImageUrlForPng() {
        return new Promise((resolve, reject) => {
            this._pack.loadPartAsBase64(this._name).then(content => {
                const mimeType = 'image/png';
                this._imageUrl = `data:${mimeType};base64,${content}`;
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    }
    _getImageUrlForTiff() {
        return new Promise((resolve, reject) => {
            this._pack.loadPartAsBinary(this._name).then(buff => {
                const ifds = UTIF.decode(buff);
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
                UTIF.decodeImage(buff, page, ifds);
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
                    this._imageUrl = canvas.toDataURL();
                    resolve();
                }
                else {
                    reject("Unable to create offscreen Canvas element");
                }
            }).catch(error => {
                reject(error);
            });
        });
    }
    _getImageUrlForEmf() {
        return new Promise((resolve, reject) => {
            if (EMFJS == undefined) {
                reject("EMFJS library not loaded, unable to read EMF images");
            }
            else {
                EMFJS.loggingEnabled(false);
                this._pack.loadPartAsBinary(this._name).then(buffer => {
                    const renderer = new EMFJS.Renderer(buffer);
                    const result = this._renderMF(renderer, this.bounds);
                    if (result !== undefined) {
                        this._imageUrl = result;
                        resolve();
                    }
                    else {
                        reject("Error during WMF parsing.");
                    }
                }).catch(error => {
                    reject(error);
                });
            }
        });
    }
    _getImageUrlForWmf() {
        return new Promise((resolve, reject) => {
            if (WMFJS == undefined) {
                reject("WMFJS library not loaded, unable to read WMF images");
            }
            else {
                WMFJS.loggingEnabled(false);
                this._pack.loadPartAsBinary(this._name).then(buffer => {
                    const renderer = new WMFJS.Renderer(buffer);
                    const result = this._renderMF(renderer, this.bounds);
                    if (result !== undefined) {
                        this._imageUrl = result;
                        resolve();
                    }
                    else {
                        reject("Error during WMF parsing.");
                    }
                }).catch(error => {
                    reject(error);
                });
            }
        });
    }
    _renderMF(renderer, bounds) {
        const width = bounds.width;
        const height = bounds.height;
        const settings = {
            width: width + "px",
            height: height + "px",
            xExt: width,
            yExt: height,
            mapMode: 8
        };
        const result = renderer.render(settings);
        return result;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGljdHVyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kcmF3aW5nL3BpY3R1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBU3RDLE1BQU0sT0FBTyxPQUFPO0lBdUJoQixZQUFZLElBQWEsRUFBRSxJQUFZO1FBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLENBQUM7SUFwQk0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFrQixFQUFFLElBQWU7UUFDekQsSUFBSSxHQUFHLEdBQXdCLFNBQVMsQ0FBQztRQUN6QyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUN4QixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3pELElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtnQkFDcEIsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ2hELElBQUksTUFBTSxHQUF1QixTQUFTLENBQUM7Z0JBQzNDLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtvQkFDekQsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM3QyxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLE1BQU0sRUFBRSxDQUFDLENBQUM7aUJBQ2xEO2FBQ0o7U0FDSjtRQUNELE9BQU8sR0FBRyxDQUFD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