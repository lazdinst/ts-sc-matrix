import styled from 'styled-components';

interface SectionProps {
  flexDirection?: 'row' | 'column';
  padding?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  width?: string;
  height?: string;
}

const Section = styled.section<SectionProps>`
  display: flex;
  padding: ${(props) => (props.padding ? props.padding : '')};
  width: ${(props) => props.width || 'inherit'};
  height: ${(props) => props.height || 'inherit'};
  flex-direction: ${(props) => props.flexDirection || 'row'};
  justify-content: ${(props) => props.justifyContent || 'flex-start'};
  align-items: ${(props) => props.alignItems || 'flex-start'};
  gap: ${(props) => props.gap || '0'};
`;

export default Section;
