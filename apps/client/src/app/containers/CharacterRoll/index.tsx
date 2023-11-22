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

import {
  getSymbolImageByRace,
  parseUnitName,
  getUnitTypeDisplayName,
  getUnitImage,
} from '../../utils';

const CharacterRoll: React.FC = () => {
  const playerOne = useSelector((state: RootState) => state.roller.playerOne);
  const playerTwo = useSelector((state: RootState) => state.roller.playerTwo);
  const players = [playerOne, playerTwo];

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
              <CardSubHeader>
                <h3>{player.name}</h3>
              </CardSubHeader>
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
