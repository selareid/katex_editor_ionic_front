import React, { useEffect, useImperativeHandle, useRef } from "react";
import "katex/dist/katex.min.css";
import "./KatexOutputField.css";
const katex = require("katex/dist/katex.min.js");

const KatexOutputField = React.forwardRef<any, {rawKatex: string, width?: string}>((props, ref) => {
    const renderPointRef = useRef(null);

    useEffect(() => {
        if (renderPointRef.current) {
            const renderPoint = renderPointRef.current as HTMLElement;

            // Render katex into the span
            try {
                renderPoint.innerHTML = katex.renderToString(props.rawKatex, {displayMode:true, trust: true, throwOnError: true});
                renderPoint.style.height = "";
            }
            catch (e) {
                if (e instanceof katex.ParseError) {
                    // render failed, re-render - keep old height (so scroll doesn't get messed up by small element)
                    const oldHeight = renderPoint.offsetHeight;
                    renderPoint.innerHTML = katex.renderToString(props.rawKatex, {displayMode:true, trust: true, throwOnError: false});
                    renderPoint.style.height = oldHeight + "px";
                }
            }
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