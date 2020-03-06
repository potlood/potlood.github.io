export var WordSeperator;
(function (WordSeperator) {
    WordSeperator[WordSeperator["Space"] = 0] = "Space";
    WordSeperator[WordSeperator["Dash"] = 1] = "Dash";
    WordSeperator[WordSeperator["Tab"] = 2] = "Tab";
    WordSeperator[WordSeperator["LineFeed"] = 3] = "LineFeed";
})(WordSeperator || (WordSeperator = {}));
export class WordSplitter {
    constructor(texts) {
        this._texts = texts;
    }
    get words() {
        if (this._words === undefined) {
            this._split();
        }
        return this._words || [];
    }
    getSeperator(index) {
        if (this._words === undefined) {
            this._split();
        }
        return this._seperators[index];
    }
    /**
     * Combine the words from start to end index, inclusive.
     */
    combine(start, end) {
        const results = [];
        if (this._words === undefined) {
            this._split();
        }
        const words = this._words;
        for (let i = start; i <= end; i++) {
            results.push(words[i]);
            const sep = this.getSeperator(i);
            switch (sep) {
                case WordSeperator.Dash:
                    results.push("-");
                    break;
                case WordSeperator.Tab:
                    // Push nothing
                    break;
                default:
                    results.push(" ");
                    break;
            }
        }
        return results.join("");
    }
    _split() {
        const txt = this._texts.join('');
        this._words = txt.split(/[\s-\t]/);
        const seperators = [];
        let index = 0;
        for (let i = 1; i < this._words.length; i++) {
            index += this._words[i - 1].length;
            const currentChar = txt.charAt(index);
            switch (currentChar) {
                case " ":
                    seperators.push(WordSeperator.Space);
                    break;
                case "-":
                    seperators.push(WordSeperator.Dash);
                    break;
                case "\t":
                    seperators.push(WordSeperator.Tab);
                    break;
                case "\r":
                case "\n":
                    seperators.push(WordSeperator.LineFeed);
                    break;
                default:
                    console.log("Invalid seperator character found, assuming a space.");
                    seperators.push(WordSeperator.Space);
                    break;
            }
            index++;
        }
        this._seperators = seperators;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29yZC1zcGxpdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXh0L3dvcmQtc3BsaXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsTUFBTSxDQUFOLElBQVksYUFLWDtBQUxELFdBQVksYUFBYTtJQUNyQixtREFBSyxDQUFBO0lBQ0wsaURBQUksQ0FBQTtJQUNKLCtDQUFHLENBQUE7SUFDSCx5REFBUSxDQUFBO0FBQ1osQ0FBQyxFQUxXLGFBQWEsS0FBYixhQUFhLFFBS3hCO0FBRUQsTUFBTSxPQUFPLFlBQVk7SUFLckIsWUFBWSxLQUFlO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFXLEtBQUs7UUFDWixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQzNCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNqQjtRQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVNLFlBQVksQ0FBQyxLQUFhO1FBQzdCLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDM0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2pCO1FBQ0QsT0FBTyxJQUFJLENBQUMsV0FBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7T0FFRztJQUNJLE9BQU8sQ0FBQyxLQUFhLEVBQUUsR0FBVztRQUNyQyxNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7UUFDN0IsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUMzQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDakI7UUFDRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTyxDQUFDO1FBQzNCLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLFFBQU8sR0FBRyxFQUFFO2dCQUNSLEtBQUssYUFBYSxDQUFDLElBQUk7b0JBQ25CLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2xCLE1BQU07Z0JBQ1YsS0FBSyxhQUFhLENBQUMsR0FBRztvQkFDbEIsZUFBZTtvQkFDZixNQUFNO2dCQUNWO29CQUNJLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2xCLE1BQU07YUFDYjtTQUNKO1FBQ0QsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFTyxNQUFNO1FBQ1YsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sVUFBVSxHQUFvQixFQUFFLENBQUM7UUFDdkMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3pDLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDbkMsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QyxRQUFPLFdBQVcsRUFBRTtnQkFDaEIsS0FBSyxHQUFHO29CQUNKLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNyQyxNQUFNO2dCQUNWLEtBQUssR0FBRztvQkFDSixVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDcEMsTUFBTTtnQkFDVixLQUFLLElBQUk7b0JBQ0wsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ25DLE1BQU07Z0JBQ1YsS0FBSyxJQUFJLENBQUM7Z0JBQ1YsS0FBSyxJQUFJO29CQUNMLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUN4QyxNQUFNO2dCQUNWO29CQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0RBQXNELENBQUMsQ0FBQztvQkFDcEUsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3JDLE1BQU07YUFDYjtZQUNELEtBQUssRUFBRSxDQUFDO1NBQ1g7UUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0NBQ0oifQ==