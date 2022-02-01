import { renderToString } from "katex";
import React, { useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
const katex = require("katex/dist/katex.min.js");

const KatexOutputField: React.FC<{rawKatex: string}> = ({ rawKatex }) => {
    const renderPoint = useRef(null);

    useEffect(() => {
        if (renderPoint.current) {
            // Render katex into the span
            (renderPoint.current as HTMLElement).innerHTML = katex.renderToString(rawKatex, {displayMode:true, throwOnError: false});
        }
    }, [rawKatex]);

    return (
        <span ref={renderPoint}></span>
    );
}

export default KatexOutputField;