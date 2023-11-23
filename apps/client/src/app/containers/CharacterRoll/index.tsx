import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  CharacterGridContainer,
  CharacterSquare,
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
      {players.map((player) => {
        return (
          <CharacterGridContainer>
            <CharacterSquare>
              <CharacterRaceImage
                src={getSymbolImageByRace(player.race).symbol}
                alt={player.race}
              />
              <PlayerNameHeader textShadow={getRaceColor(player.race)}>
                {player.name}
              </PlayerNameHeader>
            </CharacterSquare>
            {player.units.map((unit, index) => (
              <CharacterSquare key={unit._id}>
                <CharacterSquareImage
                  src={getUnitImage(unit.name)}
                  alt={unit.name}
                />
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
