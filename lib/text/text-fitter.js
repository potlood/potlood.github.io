import { InSequence } from "../utils/in-sequence.js";
import { Metrics } from "../utils/metrics.js";
import { FontMetrics } from "../utils/font-metrics.js";
export class TextFitter {
    constructor(run) {
        this.lastXPadding = 0;
        this._run = run;
        this._lineHeight = this._run.style.lineSpacing;
        this.lines = [];
    }
    getFlowLines(flow) {
        let inRun = InSequence.First;
        let currentXPadding = this._getInitialXPadding();
        let isFollowing = this._isFollowing;
        this._fixYPosition(isFollowing, flow);
        let txt = this._run.texts.join(' ');
        txt = this._fixCaps(txt);
        const words = txt.split(' ');
        let previousEnd = 0;
        let currentLength = 0;
        let numAvailableChars = this._getAvailableChars(currentXPadding, flow);
        let isLastLine = false;
        for (let i = 0; i < words.length; i++) {
            currentLength += words[i].length + 1;
            isLastLine = (i === words.length - 1);
            const isNewLine = words[i] === '\n';
            let reachedEndOfLine = isLastLine || isNewLine;
            if ((i + 1) < words.length && currentLength + words[i + 1].length >= numAvailableChars) {
                // Next word would go over the boundary, chop now.
                reachedEndOfLine = true;
            }
            if (reachedEndOfLine) {
                inRun = (isLastLine) ? InSequence.Last : inRun;
                this._pushNewLine(txt.substr(previousEnd, currentLength), flow, isFollowing, inRun, currentXPadding);
                if (!isLastLine) {
                    isFollowing = false;
                    inRun = InSequence.Middle;
                    currentXPadding = this._getIndentation(inRun);
                    numAvailableChars = this._getAvailableChars(currentXPadding, flow);
                    previousEnd += currentLength;
                    currentLength = 0;
                }
            }
        }
        this.lastXPadding = this._finalXPadding(currentXPadding, flow);
    }
    get _isFirstRun() {
        return (this._run.inParagraph === InSequence.First || this._run.inParagraph === InSequence.Only);
    }
    get _isLastRun() {
        return (this._run.inParagraph === InSequence.Last || this._run.inParagraph === InSequence.Only);
    }
    _pushNewLine(txt, flow, isFollowing, inRun, xPadding) {
        const isLastLine = (inRun === InSequence.Last || inRun === InSequence.Only);
        const isLastRun = (this._run.inParagraph === InSequence.Last || this._run.inParagraph === InSequence.Only);
        this.lines.push({
            text: txt,
            x: flow.getX() + xPadding,
            y: flow.getY(),
            width: flow.getWidth() - xPadding,
            fitWidth: !isLastLine,
            following: isFollowing,
            inRun: inRun
        });
        if (isLastRun || !isLastLine) {
            flow.advancePosition(this._lineHeight);
        }
    }
    _fixCaps(txt) {
        if (this._run.style.caps || this._run.style.smallCaps) {
            txt = txt.toLocaleUpperCase();
        }
        return txt;
    }
    _fixYPosition(isFollowing, flow) {
        if (!isFollowing) {
            // Text is on baseline, flow is at the top, correcting here.
            flow.advancePosition(FontMetrics.getTopToBaseline(this._run.style));
        }
    }
    get _isFollowing() {
        let isFollowing;
        if (this._run.previousXPos === undefined || this._isFirstRun) {
            isFollowing = false;
        }
        else {
            isFollowing = true;
        }
        return isFollowing;
    }
    _getIndentation(inRun) {
        return this._run.style.getIndentation(inRun, this._run.inParagraph);
    }
    _getAvailableChars(xPadding, flow) {
        return FontMetrics.fitCharacters(flow.getWidth() - xPadding, this._run.style);
    }
    _getInitialXPadding() {
        let xPadding = 0;
        if (this._run.previousXPos === undefined || this._isFirstRun) {
            xPadding = this._getIndentation(InSequence.First);
        }
        else {
            xPadding = this._run.previousXPos;
        }
        return xPadding;
    }
    _finalXPadding(currentXPadding, flow) {
        if (this.lines.length === 1) {
            this.lines[0].inRun = InSequence.Only;
        }
        if (this._isLastRun) {
            flow.advancePosition(FontMetrics.getBaselineToBottom(this._run.style));
        }
        return currentXPadding + Metrics.getTextWidth(this.lines[this.lines.length - 1].text, this._run.style);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1maXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGV4dC90ZXh0LWZpdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFckQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUV2RCxNQUFNLE9BQU8sVUFBVTtJQU1uQixZQUFZLEdBQVk7UUFKakIsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFLcEIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDaEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFDL0MsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVNLFlBQVksQ0FBQyxJQUFpQjtRQUNqQyxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQzdCLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQ2pELElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDcEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLElBQUksYUFBYSxHQUFH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