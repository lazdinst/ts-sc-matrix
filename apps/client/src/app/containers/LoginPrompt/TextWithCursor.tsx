import React, { useEffect, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { getRandomInt } from '../../utils';

const blinkAnimation = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
`;

interface StyledTextWithCursorProps {
  displayCursor: boolean;
}

const StyledTextWithCursor = styled.div<StyledTextWithCursorProps>`
  display: flex;
  align-items: center;
  position: relative;
  line-height: 1.2rem;
  color: rgb(0, 255, 136, 0.5);
  font-family: courier;
  text-shadow: 1px 1px 2px rgb(0, 255, 136, 0.5), 1px 1px 2px #000;
  & > span {
    font-family: courier;
    font-size: 1rem;
  }

  &::after {
    content: '';
    display: ${(props) => (props.displayCursor ? 'inline-block' : 'none')};
    width: 10px;
    height: 1.2em;
    background-color: rgb(0, 255, 136, 0.5);
    animation: ${blinkAnimation} 1s infinite;
  }
`;

interface TextWithCursorProps {
  speedModifier?: number;
  callback: (isReady: boolean) => void;
}

const lines = [
  'Wake up, Neo.',
  'The Matrix has you.',
  'Follow the white rabbit.',
  'Knock, knock, Neo.',
];

const TRANSITION_TIME = 3000;
const TYPE_SPEED = 150;

class TextAnimation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      displayText: '',
      displayCursor: true,
      lineIndex: 0,
    };
    this.animationInterval = null;
    this.animationManagerTimeout = null;
  }

  completeAnimation = () => {
    const { callback } = this.props;
    setTimeout(() => {
      if (callback) callback(true);
      this.setState({
        displayText: '',
        displayCursor: false,
      });
    }, TRANSITION_TIME);
  };

  isEndOfLine = () => {
    const { lineIndex } = this.state;
    if (lineIndex == null) throw new Error('No linesIndex found in state.');
    return lineIndex === lines.length - 1;
  };

  endOfLineValidation = () => {
    if (this.isEndOfLine()) {
      this.completeAnimation();
    } else {
      this.continueNextLine();
    }
  };

  continueNextLine = () => {
    const { lineIndex } = this.state;
    const nextIndex = lineIndex + 1;
    this.setState({
      lineIndex: nextIndex,
    });

    setTimeout(() => {
      this.setState({
        displayText: '',
      });
      this.animation(lines[nextIndex]);
    }, TRANSITION_TIME);
  };

  animation = (text: string) => {
    let index = 0;
    this.animationInterval = setInterval(() => {
      if (index > text.length - 1) {
        index = 0;
        clearInterval(this.animationInterval);
        this.endOfLineValidation();
        return;
      }
      const next = text[index];
      if (!next) throw new Error('No next character found to animate.');

      index += 1;
      this.setState((current) => {
        const nextDisplayText = current.displayText + next;
        return {
          displayText: nextDisplayText,
        };
      });
    }, TYPE_SPEED);
  };

  animationManager = () => {
    const { lineIndex } = this.state;
    this.animationManagerTimeout = setTimeout(() => {
      this.animation(lines[lineIndex]);
    }, TRANSITION_TIME);
  };

  componentDidMount() {
    this.animationManager();
  }

  componentWillUnmount(): void {
    if (this.animationInterval) clearInterval(this.animationInterval);
    if (this.animationManagerTimeout)
      clearTimeout(this.animationManagerTimeout);
  }

  render() {
    const { displayText, displayCursor } = this.state;
    return (
      <div>
        {displayText && (
          <StyledTextWithCursor
            displayCursor={displayCursor}
            onClick={() => null}
          >
            <span>{displayText}</span>
          </StyledTextWithCursor>
        )}
      </div>
    );
  }
}

export default TextAnimation;

// const TextWithCursor: React.FC<TextWithCursorProps> = ({
//   callback,
//   speedModifier = 1,
// }) => {
//   const [displayedText, setDisplayedText] = useState('');
//   const [displayCursor, setDisplayCursor] = useState(true);
//   const [lettersIndex, setLettersIndex] = useState(0);

//   const completeAnimation = useCallback(() => {
//     setTimeout(() => {
//       if (callback) callback(true);
//       setDisplayedText('');
//       setDisplayCursor(false);
//     }, TRANSITION_TIME);
//   }, []);

//   const typeText = useCallback(
//     (text: string, lettersIdx: number) => {
//       let index = 0;

//       const interval = setInterval(() => {
//         if (index > text.length - 1) {
//           index = 0;
//           clearInterval(interval);
//           validateNextLine(lettersIdx);
//           return;
//         }

//         setDisplayedText((current) => {
//           const next = text[index];
//           if (!next) return current;
//           const nextDisplayText = current + next;
//           index += 1;
//           return nextDisplayText;
//         });
//       }, 200);
//     },
//     [setDisplayedText, validateNextLine]
//   );

//   useEffect(() => {
//     setLettersIndex(0);
//     setDisplayedText('');
//     setTimeout(() => {
//       typeText(lines[0], 0);
//     }, TRANSITION_TIME);
//   }, []);

//   return (
//     <div>
//       {displayedText && (
//         <StyledTextWithCursor
//           displayCursor={displayCursor}
//           onClick={() => null}
//         >
//           <span>{displayedText}</span>
//         </StyledTextWithCursor>
//       )}
//     </div>
//   );
// };

// export default TextWithCursor;
