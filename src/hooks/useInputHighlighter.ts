import { useEffect, useState } from "react";

export function useInputHighlighter(initialState: string | "") {
    const [rawInput, setRawInput] = useState<string>(initialState);
    const [highlightedInput, setHighlightedInput] = useState<string>("");

    useEffect(() => {
        setHighlightedInput(getHighlightedInput(rawInput));
    }, [rawInput]);

    return {
        input: {raw: rawInput,
             highlighted: highlightedInput},
        setRawInput: setRawInput
    };
}

export interface Input {
    raw: string,
    highlighted: string,
}

const startHighlight = ['\\'];
const endHighlight = ['&', ' ', '{','}','<','>','=', '_', '$', '^', '#', '%', '~', '\n', '?', '(', ')', '|', '[', ']', ';', ':', '"', "'", '/', '.', ','];
const slashHighlightOrange = ['#', '$', '%', '^', '_', '~', '\\'];

function getHighlightedInput(rawInput: string) {
    let newText = rawInput;

    var position = 0;
    var startPos = undefined;
    var startChar = undefined;

    while (position < newText.length) {
        let curChar = newText[position];
        
        if (startPos === undefined && curChar === '\\' && slashHighlightOrange.includes(newText[position + 1])) { // case of \<orange highlight> e.g. \_
            let insertTextP1 = '<span style="color:#FFA500">';
            let insertTextP2 = '</span>';

            newText = newText.slice(0, position) + insertTextP1 + curChar + newText[position + 1] + insertTextP2 + newText.slice(position + 2);

            position += 1 + insertTextP1.length + 1 + insertTextP2.length;
        }
        else if (startPos === undefined && curChar === '\\' && newText.slice(position + 1, position + 6) === '&amp;') { // case of \& cause & is &amp; in html
            let insertTextP1 = '<span style="color:#FFA500">';
            let insertTextP2 = '</span>';

            newText = newText.slice(0, position) + insertTextP1 + curChar + newText[position + 1] + insertTextP2 + newText.slice(position + 6);

            position += 1 + insertTextP1.length + 1 + insertTextP2.length;
        }
        else if (startPos === undefined && curChar === '\\' && newText.length > position + 'color{}'.length && newText.substring(position, position+7) === '\\color{') { // case of \color{<color name>}
            // highlight the \color part
            let insertText1 = '<span style="color:#70d14d">';
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
            let insertText = '<span style="color:#70d14d">';

            newText = newText.slice(0, position) + insertText + newText.slice(position);

            startPos = position + insertText.length;
            startChar = curChar;

            position += 1 + insertText.length;
        }
        else if (startPos !== undefined && endHighlight.includes(curChar)) { //regular end
            let insertText = '</span>';

            newText = newText.slice(0, position) + insertText + newText.slice(position);

            startPos = undefined;
            startChar = undefined;

            position += 1 + insertText.length;
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

    return newText;
}