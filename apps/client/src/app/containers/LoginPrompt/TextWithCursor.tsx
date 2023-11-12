import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const blinkAnimation = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
`;

const StyledTextWithCursor = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  line-height: 1.2rem;
  color: green;
  & > span {
    font-family: monospace;
  }

  &::after {
    content: '';
    display: inline-block;
    width: 10px;
    height: 1.2em;
    background-color: rgb(0, 255, 0, 0.5);
    animation: ${blinkAnimation} 1s infinite;
  }
`;

interface TextWithCursorProps {
  text: string;
  speedModifier?: number;
}

const TextWithCursor: React.FC<TextWithCursorProps> = ({
  text,
  speedModifier = 1,
}) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const typeText = () => {
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText((prevText) => {
          const nextChar = text[index];
          index++;

          if (index === text.length) {
            clearInterval(interval);
          }

          return prevText + nextChar;
        });
      }, 1000 / (speedModifier * 5));
    };

    typeText();
  }, [text, speedModifier]);

  return (
    <StyledTextWithCursor>
      <span>{displayedText}</span>
    </StyledTextWithCursor>
  );
};

export default TextWithCursor;
