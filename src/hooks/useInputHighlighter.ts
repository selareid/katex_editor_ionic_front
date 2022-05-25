import { useEffect, useState } from "react";

export interface Input {
    raw: string,
    highlighted: string,
}

interface HighlightChunk {
    raw: string,
    highlighted: string,
}

interface HighlightState {
    chunks: HighlightChunk[],
    fullHighlightedString: string,
}


export function useInputHighlighter(initialState: string | "") {
    const [rawInput, setRawInput] = useState<string>(initialState);
    const [highlightState, setHighlightedState] = useState<HighlightState>({chunks: [], fullHighlightedString: ""});
    

    useEffect(() => {
        const timeOutId = setTimeout(() => highlightInput(cleanHTML(rawInput), highlightState, setHighlightedState), 0);
        return () => clearTimeout(timeOutId);
    }, [rawInput]);

    return {
        input: {raw: rawInput,
             highlighted: highlightState.fullHighlightedString},
        setRawInput: setRawInput
    };
}

function cleanHTML(rawInput: string): string {
    return rawInput.replace(/([&])/g, "&amp;").replace(/([<])/g, "&lt;").replace(/([>])/g, "&gt;").replace(/(['])/g, "&apos;").replace(/(["])/g, "&quot;");
}

function highlightInput(inputString: string, highlightState: HighlightState, setHighlightedState: React.Dispatch<React.SetStateAction<HighlightState>>) {
    let differenceStartPos_raw: number | null = null; // position of difference in inputString
    let differenceStartPos_highlight: number | null = null; // position of difference in highlight string
    let currentChunkStartRaw = 0; // chunk start position in the raw inputString
    let currentChunkStartHighlight = 0; // chunk start position in the raw inputString
    let differenceChunk_i = 0;

    for (let chunk_i = 0; chunk_i < highlightState.chunks.length; chunk_i++) {
        const chunk = highlightState.chunks[chunk_i];

        const endOfChunkRaw = currentChunkStartRaw + chunk.raw.length;

        if (inputString.substring(currentChunkStartRaw, endOfChunkRaw) === chunk.raw // no chunk difference
            && endOfChunkRaw <= inputString.length) { // when chunk ends, raw still existing
            currentChunkStartRaw = endOfChunkRaw;
            currentChunkStartHighlight += chunk.highlighted.length;
        }
        else { //difference in this chunk
            differenceStartPos_raw = currentChunkStartRaw;
            differenceStartPos_highlight = currentChunkStartHighlight;
            differenceChunk_i = chunk_i;
            break;
        }
    }

    if (highlightState.chunks.length > 0) { // change after cached chunks
        differenceStartPos_raw = currentChunkStartRaw;
        differenceStartPos_highlight = currentChunkStartHighlight;
    }

    if (currentChunkStartRaw === 0) { // <2 chunks exist or difference in first chunk
        const [fullHighlightedString, highLightChunks] = getHighlightedString(inputString);
        setHighlightedState({fullHighlightedString, chunks: highLightChunks});
    }
    else if (differenceStartPos_raw !== null && differenceStartPos_highlight !== null) { //difference detected in other chunk
        //TODO re-highlight from chunk
        const [rehighlightedSubString, rehighlightedChunks] = getHighlightedString(inputString.substring(differenceStartPos_raw));

        let fullHighlightedString = highlightState.fullHighlightedString.substring(0, differenceStartPos_highlight) + rehighlightedSubString;

        setHighlightedState({fullHighlightedString, chunks: highlightState.chunks.slice(0, differenceChunk_i).concat(rehighlightedChunks)});

    }


    //TODO set highlight state

}


const startHighlight = ['\\'];
const endHighlight = ['&', ' ', '{','}','<','>','=', '_', '$', '^', '#', '%', '~', '\n', '?', '(', ')', '|', '[', ']', ';', ':', '"', "'", '/', '.', ','];
const slashHighlightOrange = ['#', '$', '%', '^', '_', '~', '\\'];
const isNumeric = (num: any) => (typeof(num) === 'number' || typeof(num) === "string" && num.trim() !== '') && !isNaN(num as number);
const isASCII = (c: string) => c.charCodeAt(0) <= 126; // non-ascii characters have undocumented behaviour with backend

function getHighlightedString(rawInput: string): [string, HighlightChunk[]] {
    let newText: string = rawInput;
    const chunks: HighlightChunk[] = [];

    var position = 0;
    var startPos = undefined;
    var startChar = undefined;
    var lastChunkEnd = {raw: 0, hightlighted: 0};

    function endLastChunkStartNew() {
        let rawAdjustedPosition = position - Math.abs(rawInput.length - newText.length);
        let rawChunk = rawInput.substring(lastChunkEnd.raw, rawAdjustedPosition);
        let highlightedChunk = newText.substring(lastChunkEnd.hightlighted, position);
        chunks.push({raw: rawChunk, highlighted: highlightedChunk});
        
        lastChunkEnd.raw = rawAdjustedPosition;
        lastChunkEnd.hightlighted = position;
    }

    while (position < newText.length) {
        let curChar = newText[position];
        
        if (startPos === undefined && !isASCII(curChar)) { // highlight scary characters in red
            let insertTextP1 = '<span class="highlight-red">';
            let insertTextP2 = '</span>';

            newText = newText.slice(0, position) + insertTextP1 + curChar + insertTextP2 + newText.slice(position + 1);
            position += insertTextP1.length + insertTextP2.length;
        }
        if (startPos === undefined && curChar === '\\' && slashHighlightOrange.includes(newText[position + 1])) { // case of \<orange highlight> e.g. \_
            let insertTextP1 = '<span class="highlight-orange">';
            let insertTextP2 = '</span>';

            newText = newText.slice(0, position) + insertTextP1 + curChar + newText[position + 1] + insertTextP2 + newText.slice(position + 2);

            position += 1 + insertTextP1.length + 1 + insertTextP2.length;
        }
        else if (startPos === undefined && curChar === '\\' && newText.slice(position + 1, position + 6) === '&amp;') { // case of \& cause & is &amp; in html
            let insertTextP1 = '<span class="highlight-orange">';
            let insertTextP2 = '</span>';

            newText = newText.slice(0, position) + insertTextP1 + curChar + newText[position + 1] + insertTextP2 + newText.slice(position + 6);

            position += 1 + insertTextP1.length + 1 + insertTextP2.length;
        }
        else if (startPos === undefined && curChar === '\\' && newText.length > position + 'color{}'.length && newText.substring(position, position+7) === '\\color{') { // case of \color{<color name>}
            // highlight the \color part
            let insertText1 = '<span class="highlight-green">';
            let insertText2 = '</span>';
            newText = newText.slice(0, position) + insertText1 + '\\color' + insertText2 + newText.slice(position+6);
            position += insertText1.length + insertText2.length + '\\color'.length;

            position++; // skip the {

            // highlight the <color name> in its own colour
            let i = position;
            let buffer = '';
            while (true) {
                let c = newText[i];

                if ((startHighlight.includes(c) || endHighlight.includes(c) || slashHighlightOrange.includes(c))
                 && c !== '}' && !(c === '#' && i === position && newText[position+7] === '}' || i === position && newText[position+4] === '}')) break; // special characters, except } and when color is hash code
                else if (c === '}') { // end of colour text, highlight
                    let insertText3 = '<span style="color:'+buffer+'">';
                    let insertText4 = '</span>';
                    newText = newText.slice(0, position) + insertText3 + buffer + insertText4 + newText.slice(position+buffer.length);
                    position += insertText3.length + insertText4.length + buffer.length;
                    break;
                }
                else if (c) buffer += c;
                else break; // end of text

                i++;
            }

            position++; // skip the }
        }
        else if (startPos === undefined && startHighlight.includes(curChar)) { // regular start
            let insertText = '<span class="highlight-green">';

            newText = newText.slice(0, position) + insertText + newText.slice(position);

            startPos = position + insertText.length;
            startChar = curChar;

            position += 1 + insertText.length;
        }
        else if (startPos !== undefined && (endHighlight.includes(curChar) || isNumeric(curChar) || !isASCII(curChar))) { //regular end
            let insertText = '</span>';

            newText = newText.slice(0, position) + insertText + newText.slice(position);
            
            
            startPos = undefined;
            startChar = undefined;
            
            position += 1 + insertText.length;
            if (!isASCII(curChar)) position--; //re-process this character so it gets red-highlighted
            
            endLastChunkStartNew();
        }
        else if (startPos !== undefined && position !== startPos && startHighlight.includes(curChar)) { // back to back highlighting e.g. \quad\quad
            //  - close previous highlight and processes this position again on next loop
            // done this way since going from "\quad \quad" to "\quad\quad" created inconsistent behaviour 
            // with the cursor position due to the combination of the hidden highlight html code

            let insertText = '</span>';

            newText = newText.slice(0, position) + insertText + newText.slice(position);

            startPos = undefined;
            startChar = undefined;

            position += insertText.length;
        }
        else {
            position++;
        }
    }

    //finished going through text and haven't ended the highlight
    if (startPos !== undefined) {
        newText = newText += '</span>';
    }

    //add any remaining text in a final chunk
    if (lastChunkEnd.hightlighted < position) {
        endLastChunkStartNew();
    }


    return [newText, chunks];
}