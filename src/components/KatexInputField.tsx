import './KatexInputField.css';
import { useInputHighlighter } from '../hooks/useInputHighlighter';
import React, { useEffect, useRef } from 'react';

const KatexInputField: React.FC<{defaultInput?: string, onInput?: Function}> = (props) => {
  const inputBoxRef = useRef(null);
  const { input, setRawInput } = useInputHighlighter(props.defaultInput || "");

  const handleInputUpdate = (event: React.FormEvent<HTMLPreElement>) => {
    setRawInput((event.target as HTMLElement).innerText);

    if (props.onInput) {
      props.onInput(event);
    }
  }

  useEffect(() => {
    if (inputBoxRef.current !== null) {
      (inputBoxRef.current as HTMLElement).innerText = input.raw; // set with initial value
    }
  }, []);

  useEffect(() => {
    (inputBoxRef.current! as HTMLElement).focus();
  }, []);


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
}


export default KatexInputField;