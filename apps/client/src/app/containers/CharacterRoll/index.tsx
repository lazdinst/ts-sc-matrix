import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  CharacterGridContainer,
  CharacterSquare,
} from '../../components/CharacterGrid';
import {
  Card,
  CardImage,
  CardHeader,
  CardSubHeader,
  UnitContainer,
  UnitDetails,
  UnitName,
  UnitResources,
  UnitResourceImg,
  ShadowColor,
  UnitActions,
  UnitWrapper,
  UnitType,
} from '../../components/Card';
import minerals from '../../../assets/images/minerals.gif';
import vespene from '../../../assets/images/vespene.gif';
import styled from 'styled-components';
import {
  getSymbolImageByRace,
  parseUnitName,
  getUnitTypeDisplayName,
  getUnitImage,
} from '../../utils';

const raceColors: {
  zerg: string;
  terran: string;
  protoss: string;
} = {
  zerg: '#8400ff',
  terran: '#ff0000',
  protoss: '#0004ff',
};

interface PlayerNameHeaderProps {
  textShadow?: string;
}

const PlayerNameHeader = styled.div<PlayerNameHeaderProps>`
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

const CharacterRoll: React.FC = () => {
  const players = useSelector((state: RootState) => state.roller.players);

  const getRaceColor = (race: string) => {
    if (!race) return;

    const result = (raceColors as any)[race]; // Use type assertion
    return result;
  };
  return (
    <>
      {players.map((player) => {
        return (
          <CharacterGridContainer>
            <CharacterSquare>
              <img
                src={getSymbolImageByRace(player.race).symbol}
                alt={player.race}
              />
              <PlayerNameHeader textShadow={getRaceColor(player.race)}>
                <h3>{player.name}</h3>
              </PlayerNameHeader>
            </CharacterSquare>
            {player.units.map((unit, index) => (
              <CharacterSquare key={unit._id}>
                <img src={getUnitImage(unit.name)} alt={unit.name} />
                <UnitWrapper id="unit-wrapper" key={`${unit.name}${unit._id}`}>
                  <UnitDetails>
                    <UnitName>
                      <span>{parseUnitName(unit.name)}</span>
                      <UnitType type={unit.type}>
                        {getUnitTypeDisplayName(unit.type)}
                      </UnitType>
                    </UnitName>
                  </UnitDetails>
                </UnitWrapper>
              </CharacterSquare>
            ))}
          </CharacterGridContainer>
        );
      })}
    </>
  );
};

export default CharacterRoll;
