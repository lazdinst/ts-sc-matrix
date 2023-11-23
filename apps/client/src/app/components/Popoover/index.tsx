import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';

const PopoverWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export interface PopoverContentProps {
  visible: boolean;
}

const PopoverContent = styled.div<PopoverContentProps>`
  position: absolute;
  color: ${(props) => props.theme.colors.primary};
  background-color: ${(props) => props.theme.colors.surfaces.navBg};
  border: 1px solid ${(props) => props.theme.colors.borderColor};
  border-radius: ${(props) => props.theme.components.popover.borderRadius};
  padding: 10px;
  z-index: 100;
  box-shadow: ${(props) => props.theme.components.popover.boxShadow};
  top: 0;
  left: 0;
  visibility: hidden;

  ${(props) =>
    props.visible &&
    css`
      visibility: visible;
      transform: translate(0, 0);
    `}
`;

type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';

interface PopoverProps {
  position?: PopoverPosition;
  content: React.ReactNode;
  children: React.ReactNode;
}

const Popover: React.FC<PopoverProps> = ({
  position = 'top',
  content,
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const calculatePopoverPosition = () => {
    if (wrapperRef.current) {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();

      switch (position) {
        case 'top':
          setPopoverPosition({
            top: -wrapperRect.height,
            left: 0,
          });
          break;
        case 'bottom':
          setPopoverPosition({
            top: wrapperRect.height,
            left: 0,
          });
          break;
        case 'left':
          setPopoverPosition({
            top: 0,
            left: -wrapperRect.width,
          });
          break;
        case 'right':
          setPopoverPosition({
            top: -wrapperRect.height / 2,
            left: wrapperRect.width + 8,
          });
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    calculatePopoverPosition();
    window.addEventListener('resize', calculatePopoverPosition);

    return () => {
      window.removeEventListener('resize', calculatePopoverPosition);
    };
  }, [position]);

  return (
    <PopoverWrapper
      ref={wrapperRef}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <PopoverContent
        visible={visible}
        style={{
          top: `${popoverPosition.top}px`,
          left: `${popoverPosition.left}px`,
        }}
        data-testid="popover-content"
      >
        {content}
      </PopoverContent>
    </PopoverWrapper>
  );
};

export default Popover;
