import { InSequence } from "../utils/in-sequence.js";
import { Metrics } from "../utils/metrics.js";
import { FontMetrics } from "../utils/font-metrics.js";
export class TextFitter {
    static getFlowLines(run, flow) {
        const isStartingRun = (run.inParagraph === InSequence.First || run.inParagraph === InSequence.Only);
        const isLastRun = (run.inParagraph === InSequence.Last || run.inParagraph === InSequence.Only);
        let inRun = InSequence.First;
        let currentXPadding = 0;
        let isFollowing = false;
        if (run.previousXPos === undefined || isStartingRun) {
            currentXPadding = run.style.getIndentation(inRun, run.inParagraph);
            // Text is on baseline, flow is at the top, correcting here.
            flow.advancePosition(FontMetrics.getTopToBaseline(run.style));
        }
        else {
            currentXPadding = run.previousXPos;
            isFollowing = true;
        }
        let txt = run.texts.join(' ');
        if (run.style.caps || run.style.smallCaps) {
            txt = txt.toLocaleUpperCase();
        }
        const words = txt.split(' ');
        let previousEnd = 0;
        let currentLength = 0;
        let numChars = FontMetrics.fitCharacters(flow.getWidth() - currentXPadding, run.style);
        let isLastLine = false;
        const lines = [];
        const lineHeight = run.style.lineSpacing;
        for (let i = 0; i < words.length; i++) {
            currentLength += words[i].length + 1;
            isLastLine = (i === words.length - 1);
            const isNewLine = words[i] === '\n';
            if (currentLength >= numChars || isLastLine || isNewLine) {
                lines.push({
                    text: txt.substr(previousEnd, currentLength),
                    x: flow.getX() + currentXPadding,
                    y: flow.getY(),
                    width: flow.getWidth() - currentXPadding,
                    fitWidth: !isLastLine,
                    following: isFollowing,
                    inRun: (isLastLine) ? InSequence.Last : inRun
                });
                if (isLastRun || !isLastLine) {
                    flow.advancePosition(lineHeight);
                }
                if (!isLastLine) {
                    isFollowing = false;
                    inRun = InSequence.Middle;
                    currentXPadding = run.style.getIndentation(inRun, run.inParagraph);
                    numChars = FontMetrics.fitCharacters(flow.getWidth() - currentXPadding, run.style);
                    previousEnd += currentLength;
                    currentLength = 0;
                }
            }
        }
        if (lines.length === 1) {
            lines[0].inRun = InSequence.Only;
        }
        if (isLastRun) {
            flow.advancePosition(FontMetrics.getBaselineToBottom(run.style));
        }
        return { lines: lines, lastXPos: currentXPadding + Metrics.getTextWidth(lines[lines.length - 1].text, run.style) };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1maXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGV4dC90ZXh0LWZpdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFckQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUV2RCxNQUFNLE9BQU8sVUFBVTtJQUVaLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBWSxFQUFFLElBQWlCO1FBQ3RELE1BQU0sYUFBYSxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsS0FBSyxVQUFVLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxXQUFXLEtBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BHLE1BQU0sU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsS0FBSyxVQUFVLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxXQUFXLEtBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9GLElBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDN0IsSUFBSSxlQUFlLEdBQVcsQ0FBQyxDQUFDO1FBQ2hDLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLEdBQUcsQ0FBQyxZQUFZLEtBQUssU0FBUyxJQUFJLGFBQWEsRUFBRTtZQUNqRCxlQUFlLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNuRSw0REFBNEQ7WUFDNUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDakU7YUFBTTtZQUNILGVBQWUsR0FBRyxHQUFHLENBQUMsWUFB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