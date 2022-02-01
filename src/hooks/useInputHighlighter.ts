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

function getHighlightedInput(rawInput: string): string {
    return "<span style=\"color:#70d14d\">" + rawInput + "</span>";
}