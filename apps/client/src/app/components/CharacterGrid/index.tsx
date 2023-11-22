import styled from 'styled-components';

export const CharacterGridContainer = styled.div`
  display: flex;

  gap: 1rem;

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const CharacterSquare = styled.div`
  border-radius: 4px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  background-color: ${(props) =>
    props.theme.colors.surfaces.navBg || 'inherit'};
  color: ${(props) => props.theme.colors.primary || 'inherit'};

  min-height: 225px;
  min-width: 225px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 152px;
    height: 152px;
    @media (max-width: 800px) {
      width: 100%;
    }
  }

  h2 {
    text-align: center;
    @media (max-width: 800px) {
      font-size: 1rem;
    }
  }
`;
