import { InSequence } from "../utils/in-sequence.js";
import { Metrics } from "../utils/metrics.js";
import { FontMetrics } from "../utils/font-metrics.js";
import { Justification } from "../paragraph/par-style.js";
import { WordSplitter, WordSeperator } from "./word-splitter.js";
import { ParagraphType } from "../paragraph/paragraph.js";
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
        if (this._run.hasEmptyText) {
            this.lastXPadding = currentXPadding;
            return;
        }
        this._fixYPosition(isFollowing, flow);
        const texts = this._fixAllCaps(this._run.texts);
        const splitter = new WordSplitter(texts);
        const words = splitter.words;
        if (this._run.texts.length === 1 && this._run.texts[0] === " ") {
            this.lastXPadding = currentXPadding + FontMetrics.averageCharWidth(this._run.style);
            return;
        }
        const strictFit = this._run.paragraphType === ParagraphType.TableCell;
        let tabIndex = 0;
        let previousIndex = 0;
        let currentLength = 0;
        let numAvailableChars = this._getAvailableChars(currentXPadding, flow);
        let isLastLine = false;
        let justification = this._run.style.justification;
        for (let i = 0; i < words.length; i++) {
            currentLength += words[i].length + 1;
            isLastLine = (i === words.length - 1);
            const seperator = splitter.getSeperator(i);
            const isNewLine = seperator === WordSeperator.LineFeed;
            const isTab = seperator === WordSeperator.Tab;
            let reachedEndOfLine = isLastLine || isNewLine || isTab;
            if (!reachedEndOfLine && !this._fitReasonably(currentLength, numAvailableChars, strictFit, words[i + 1])) {
                // Next word would go over the boundary, chop now.
                reachedEndOfLine = true;
            }
            if (reachedEndOfLine) {
                inRun = (isLastLine) ? InSequence.Last : inRun;
                // Ready to push the line out to the renderer.
                this._pushNewLine(splitter.combine(previousIndex, i), flow, isFollowing, isTab, inRun, currentXPadding, justification, this._run.style);
                // Resetting the state for next line.
                if (!isLastLine) {
                    isFollowing = false;
                    inRun = InSequence.Middle;
                    if (isTab) {
                        currentXPadding = this._getTabPadding(tabIndex, flow);
                        justification = this._getTabJustification(tabIndex, this._run.style, flow);
                        tabIndex++;
                    }
                    else {
                        currentXPadding = this._getIndentation(inRun);
                        tabIndex = 0;
                    }
                    numAvailableChars = this._getAvailableChars(currentXPadding, flow);
                    currentLength = 0;
                    previousIndex = i + 1;
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
    _pushNewLine(txt, flow, isFollowing, isTab, inRun, xPadding, justification, style) {
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
            emphasis: style.emphasis,
            justification: justification
        });
        if (!isTab && (isLastRun || !isLastLine)) {
            flow.advancePosition(this._lineHeight);
        }
    }
    _fixAllCaps(txts) {
        if (this._run.style.caps || this._run.style.smallCaps) {
            txts = txts.map((txt) => txt.toLocaleUpperCase());
        }
        return txts;
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
    _getTabPadding(tabIndex, flow) {
        let padding = 0;
        const tab = flow.getTab(tabIndex);
        if (tab !== undefined && tab.position !== undefined) {
            padding = tab.position;
        }
        return padding;
    }
    _getTabJustification(tabIndex, style, flow) {
        let justification = style.justification;
        const tab = flow.getTab(tabIndex);
        if (tab !== undefined) {
            justification = tab.justification;
        }
        return justification;
    }
    _getAvailableChars(xPadding, flow) {
        return FontMetrics.fitCharacters(flow.getWidth() - xPadding, this._run.style);
    }
    /**
     * Does the next word fit reasonably.
     */
    _fitReasonably(length, numAvailableChars, strictFit, nextWord) {
        if (nextWord === undefined) {
            return true;
        }
        const graceNumber = strictFit ? 0 : 1;
        const nextLength = length + nextWord.length;
        const numAcceptableChars = numAvailableChars + graceNumber;
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
        const lastLineWidth = Metrics.getTextWidth(this.lines[this.lines.length - 1].text, this._run.style);
        return currentXPadding + lastLineWidth;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1maXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGV4dC90ZXh0LWZpdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFckQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUV2RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFMUQsTUFBTSxPQUFPLFVBQVU7SUFNbkIsWUFBWSxHQUFZO1FBSmpCLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1FBS3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO1FBQy9DLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFTSxZQUFZLENBQUMsSUFBaUI7UUFDakMsSUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQztRQUM3QixJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUNqRCxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ3BDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDeEIsSUFBSSxDQUFDLFlBQVksR0FBRyxlQUFlLENBQUM7WUFDcEMsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFD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