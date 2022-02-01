import './KatexInputField.css';
import { useInputHighlighter } from '../hooks/useInputHighlighter';
import React, { useEffect, useRef } from 'react';

const KatexInputField: React.FC<{defaultInput?: string, onInput?: Function}> = (props) => {
  const inputBox = useRef(null);
  const { input, setRawInput } = useInputHighlighter(props.defaultInput || "");

  const handleInputUpdate = (event: React.FormEvent<HTMLPreElement>) => {
    setRawInput((event.target as HTMLElement).innerText);

    if (props.onInput) {
      props.onInput(event);
    }
  }

  useEffect(() => {
    if (inputBox.current !== null) {
      (inputBox.current as HTMLElement).innerText = input.raw; // set with initial value
    }
  }, []);


  return (
    <div id="input_wrapper">
          <pre id="highlightBox" dangerouslySetInnerHTML={{__html: input.highlighted}} />
          <pre id="inputBox"
            ref={inputBox}
            contentEditable={true}
            onInput={handleInputUpdate} >
              {}
            </pre>
      </div>
  );
}


export default KatexInputField;