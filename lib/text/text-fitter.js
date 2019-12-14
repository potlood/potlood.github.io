import { InSequence } from "../utils/in-sequence.js";
import { Metrics } from "../utils/metrics.js";
import { FontMetrics } from "../utils/font-metrics.js";
import { Justification } from "../paragraph/par-style.js";
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
            if (!isLastLine && !this._fitReasonably(currentLength, numAvailableChars, words[i + 1])) {
                // Next word would go over the boundary, chop now.
                reachedEndOfLine = true;
            }
            if (reachedEndOfLine) {
                inRun = (isLastLine) ? InSequence.Last : inRun;
                this._pushNewLine(txt.substr(previousEnd, currentLength), flow, isFollowing, inRun, currentXPadding, this._run.style);
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
    _pushNewLine(txt, flow, isFollowing, inRun, xPadding, style) {
        const isLastLine = (inRun === InSequence.Last || inRun === InSequence.Only);
        const isLastRun = (this._run.inParagraph === InSequence.Last || this._run.inParagraph === InSequence.Only);
        const stretched = (style.justification === Justification.both) && !isLastLine;
        this.lines.push({
            text: txt,
            x: flow.getX() + xPadding,
            y: flow.getY(),
            width: flow.getWidth() - xPadding,
            stretched: stretched,
            following: isFollowing,
            color: style.color,
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            emphasis: style.emphasis
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
    /**
     * Does the next word fit reasonably.
     */
    _fitReasonably(length, numAvailableChars, nextWord) {
        const nextLength = length + nextWord.length;
        const numAcceptableChars = numAvailableChars + 1;
        return nextLength <= numAcceptableChars;
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
        if (this._isLastRun) {
            flow.advancePosition(FontMetrics.getBaselineToBottom(this._run.style));
        }
        return currentXPadding + Metrics.getTextWidth(this.lines[this.lines.length - 1].text, this._run.style);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1maXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGV4dC90ZXh0LWZpdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFckQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUV2RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFMUQsTUFBTSxPQUFPLFVBQVU7SUFNbkIsWUFBWSxHQUFZO1FBSmpCLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1FBS3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO1FBQy9DLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFTSxZQUFZLENBQUMsSUFBaUI7UUFDakMsSUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQztRQUM3QixJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUNqRCxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLElB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