import styled from 'styled-components';

interface SectionProps {
  flexDirection?: 'row' | 'column';
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
}

const Section = styled.section<SectionProps>`
  display: flex;
  flex-direction: ${(props) => props.flexDirection || 'row'};
  justify-content: ${(props) => props.justifyContent || 'flex-start'};
  align-items: ${(props) => props.alignItems || 'flex-start'};
  gap: ${(props) => props.gap || '0'};
`;

export default Section;
