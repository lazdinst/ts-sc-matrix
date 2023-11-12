import React, { useState } from 'react';
import styled from 'styled-components';
import TextWithCursor from './TextWithCursor'; // Import the TextWithCursor component

const TerminalContainer = styled.div`
  font-family: monospace;
  background-color: rgb(0, 0, 0, 0.9);
  color: #fff;
  padding: 16px;
  border-radius: 8px;
  height: 300px;
  min-width: 300px;
  overflow-y: auto;
`;

const OutputItem = styled.div`
  margin-bottom: 8px;
`;

const Prompt = styled.span`
  color: #00ff00; /* Green color for the prompt */
`;

const InputForm = styled.form`
  display: flex;
  align-items: center;
  margin-top: 16px;
`;

const InputPrompt = styled.span`
  color: #00ff00; /* Green color for the prompt */
  margin-right: 4px;
`;

const InputField = styled.input`
  flex: 1;
  padding: 4px;
  border: none;
  background-color: transparent;
  color: rgb(0, 255, 0, 0.5);
  outline: none;
`;

interface OutputItemType {
  command: string;
  result: string;
}

const Terminal = () => {
  const [inputText, setInputText] = useState('');
  const [output, setOutput] = useState([]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();

    // Simulate command execution
    const command = inputText.trim();
    if (command) {
      const result = executeCommand(command);
      setOutput([...output, { command, result }]);
      setInputText('');
    }
  };

  const executeCommand = (command: string) => {
    // Simulate command execution and return a result
    return `Command executed: ${command}`;
  };

  return (
    <TerminalContainer>
      <TextWithCursor text={`The Matrix welcomes you ...`} />

      {output.map((item, index) => (
        <OutputItem key={index}>
          <Prompt>$</Prompt> {item.command}
          <br />
          {item.result}
        </OutputItem>
      ))}
      <InputForm onSubmit={handleInputSubmit}>
        <InputPrompt>$</InputPrompt>
        <InputField
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type a command..."
        />
      </InputForm>
    </TerminalContainer>
  );
};

export default Terminal;
