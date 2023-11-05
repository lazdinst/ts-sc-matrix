import React from 'react';
import Card from '../../components/Card';

import { getSymbolImageByRace } from '../../utils';

interface Player {
  race: string;
}

interface Unit {
  name: string;
}

interface RollCardProps {
  player: Player;
  units: string[];
}

const RollCard: React.FC<RollCardProps> = ({ player, units }) => {
  const unitObjects: Unit[] = units.map((unitName) => ({
    name: unitName,
  }));

  return (
    <Card
      imageUrl={getSymbolImageByRace(player.race).symbol}
      imageAlt={player.race}
      headerText={player.race}
      units={unitObjects}
    />
  );
};

export default RollCard;
