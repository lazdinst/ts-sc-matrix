import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  CharacterGridContainer,
  CharacterRaceSquare,
  CharacterUnitSquare,
  CharacterSquareImage,
  CharacterRaceImage,
  PlayerNameHeader,
  getRaceColor,
} from '../../components/CharacterGrid';
import {
  Card,
  CardImage,
  CardHeader,
  CardSubHeader,
  UnitContainer,
  UnitDetails,
  UnitName,
  UnitResourceText,
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

const CharacterRoll: React.FC = () => {
  const players = useSelector((state: RootState) => state.roller.players);

  return (
    <>
      {players.map((player, idx) => {
        return (
          <CharacterGridContainer
            key={player.name}
            margin={idx === 0 ? '120px' : null}
          >
            <CharacterRaceSquare race={player.race}>
              <CharacterRaceImage
                src={getSymbolImageByRace(player.race).symbol}
                alt={player.race}
              />
              <PlayerNameHeader race={player.race}>
                {player.name}
              </PlayerNameHeader>
            </CharacterRaceSquare>

            {player.units.map((unit, index) => (
              <CharacterUnitSquare key={`${player.name}${unit._id}`}>
                <CharacterSquareImage src={getUnitImage(unit.name)} />
                <UnitWrapper>
                  <UnitName>
                    <span>{parseUnitName(unit.name)}</span>
                    <UnitType type={unit.type}>
                      {getUnitTypeDisplayName(unit.type)}
                    </UnitType>
                  </UnitName>
                  <UnitResources>
                    <UnitResourceImg src={minerals} alt="mins" />
                    <UnitResourceText>{unit.mins}</UnitResourceText>
                    <UnitResourceImg src={vespene} alt="vespene" />
                    {unit.gas}
                  </UnitResources>
                </UnitWrapper>
              </CharacterUnitSquare>
            ))}
          </CharacterGridContainer>
        );
      })}
    </>
  );
};

export default CharacterRoll;
