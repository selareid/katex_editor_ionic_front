import React, { useEffect, useImperativeHandle, useRef } from "react";
import "katex/dist/katex.min.css";
import "./KatexOutputField.css";
const katex = require("katex/dist/katex.min.js");

const renderProps = {displayMode:true, trust: true, maxExpand: 10000};

const KatexOutputField = React.forwardRef<any, {rawKatex: string, width?: string, slowMode?: boolean}>((props, ref) => {
    const renderPointRef = useRef(null);

    useEffect(() => {
        const timeOutID = setTimeout(() => {
            if (renderPointRef.current) {
                const renderPoint = renderPointRef.current as HTMLElement;

                // Render katex into the span
                try {
                    renderPoint.innerHTML = katex.renderToString(props.rawKatex, {throwOnError: true, ...renderProps});
                    renderPoint.style.height = "";
                }
                catch (e) {
                    if (e instanceof katex.ParseError) {
                        // render failed, re-render - keep old height (so scroll doesn't get messed up by small element)
                        const oldHeight = renderPoint.offsetHeight;
                        try {
                            renderPoint.innerHTML = katex.renderToString(props.rawKatex, {throwOnError: false, ...renderProps});
                        } catch (e) { console.error("ERROR while rendering katex " + e);}
                        renderPoint.style.height = oldHeight + "px";
                    }
                }
            }
        }, props.slowMode ? 1000 : 0);
        return () => clearTimeout(timeOutID);
    }, [props.rawKatex, props.slowMode]);

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