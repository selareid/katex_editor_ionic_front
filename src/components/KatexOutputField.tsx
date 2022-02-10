import React, { useEffect, useImperativeHandle, useRef } from "react";
import "katex/dist/katex.min.css";
import "./KatexOutputField.css";
const katex = require("katex/dist/katex.min.js");

const KatexOutputField = React.forwardRef<any, {rawKatex: string, width?: string}>((props, ref) => {
    const renderPointRef = useRef(null);

    useEffect(() => {
        if (renderPointRef.current) {
            // Render katex into the span
            (renderPointRef.current as HTMLElement).innerHTML = katex.renderToString(props.rawKatex, {displayMode:true, throwOnError: false});
        }
    }, [props.rawKatex]);

    useImperativeHandle(ref, () => {
        if (renderPointRef.current === null) return {};
        const cur = renderPointRef.current as HTMLElement;
    
        return {
          getBoundingClientRect: () => cur.getBoundingClientRect(),
      }});

    return (
        <span ref={renderPointRef} className="katexIOElement katexOutputElement" style={props.width ? {width: props.width} : undefined}></span>
    );
});

export default KatexOutputField;