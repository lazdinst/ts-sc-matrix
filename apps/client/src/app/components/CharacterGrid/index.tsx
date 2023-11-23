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

  h2 {
    text-align: center;
    @media (max-width: 800px) {
      font-size: 1rem;
    }
  }
`;

export const CharacterRaceImage = styled.img`
  width: 152px;
  height: 152px;
  padding: 1rem 0rem;
`;

export const CharacterSquareImage = styled.img`
  width: 152px;
  height: 152px;
`;

export const getRaceColor = (race: string) => {
  if (!race) return;
  const raceColors: {
    zerg: string;
    terran: string;
    protoss: string;
  } = {
    zerg: '#8400ff',
    terran: '#ff0000',
    protoss: '#0004ff',
  };

  const result = (raceColors as any)[race]; // Use type assertion
  return result;
};

interface PlayerNameHeaderProps {
  textShadow?: string;
}

export const PlayerNameHeader = styled.div<PlayerNameHeaderProps>`
  text-align: center;
  font-family: 'eurostile';
  text-transform: uppercase;
  color: #fff;
  font-weight: 500;
  font-size: 2rem;
  text-shadow: 0 0 1.25rem
    ${(props) =>
      props.textShadow ? props.textShadow : props.theme.colors.accentColor};
  margin: 10px 0;
`;
