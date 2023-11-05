import React, { ReactNode } from "react";
import styled, { keyframes } from "styled-components";

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.colors.surfaces.mainBg};
  min-width: 248px;
  animation: ${slideIn} 0.1s ease-in-out forwards; /* Apply the animation */
`;

interface SecondarySidebarProps {
  children: ReactNode;
}

const SecondarySidebar: React.FC<SecondarySidebarProps> = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default SecondarySidebar;