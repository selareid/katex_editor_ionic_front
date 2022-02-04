import './KatexInputField.css';
import { useInputHighlighter } from '../hooks/useInputHighlighter';
import React, { useEffect, useImperativeHandle, useRef } from 'react';

const KatexInputField = React.forwardRef<any, {defaultInput?: string, onInput?: Function}>((props, ref) => {
  const inputBoxRef = useRef<HTMLPreElement>(null);
  const { input, setRawInput } = useInputHighlighter(props.defaultInput || "");

  const handleInputUpdate = (event: React.FormEvent<HTMLPreElement>) => {
    setRawInput((event.target as HTMLElement).innerText);

    if (props.onInput) {
      props.onInput(event);
    }
  }

  useEffect(() => {
    inputBoxRef.current!.innerText = input.raw; // set with initial value
  }, []);

  useEffect(() => {
    inputBoxRef.current!.focus();
  }, []);

  useImperativeHandle(ref, () => {
    if (inputBoxRef.current === null) return {};
    const cur = inputBoxRef.current;

    return {
      setInnerTextDontTriggerInput: (text: string) => {
        setRawInput(text);
        cur.innerText = text;
      },
  }});

  return (
    <div id="input_wrapper">
          <pre id="highlightBox" dangerouslySetInnerHTML={{__html: input.highlighted}} />
          <pre id="inputBox"
            ref={inputBoxRef}
            contentEditable={true}
            onInput={handleInputUpdate} >
              {}
            </pre>
      </div>
  );
});

export interface KatexInputFieldRefFrame {
  setInnerTextDontTriggerInput: (text: string) => (void)
}


export default KatexInputField;