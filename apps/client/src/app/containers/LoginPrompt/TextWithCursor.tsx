import React from 'react';
import styled, { keyframes } from 'styled-components';

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
  background-color: rgb(0, 0, 0, 0.9);
  & > span {
    font-family: courier;
    font-size: 1.25rem;
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
  callback: () => void;
}

interface TextWithCursorState {
  text: string;
  displayText: string;
  displayCursor: boolean;
  lineIndex: number;
}

const lines = [
  'Wake up, Neo.',
  'The Matrix has you.',
  'Follow the white rabbit.',
  'Knock, knock, Neo.',
];

const TRANSITION_TIME = 3000;
const TYPE_SPEED = 150;

class TextAnimation extends React.Component<
  TextWithCursorProps,
  TextWithCursorState
> {
  private animationInterval: NodeJS.Timeout | null = null;
  private animationManagerTimeout: NodeJS.Timeout | null = null;
  constructor(props: TextWithCursorProps) {
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
      if (callback) callback();
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
        if (this.animationInterval) {
          clearInterval(this.animationInterval);
        }
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
