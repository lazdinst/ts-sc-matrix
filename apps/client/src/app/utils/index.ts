import protoss from '../../assets/images/protoss.png';
import terran from '../../assets/images/terran.png';
import zerg from '../../assets/images/zerg.png';
import sc from '../../assets/images/sc.png';
import { UnitTypes } from '../../redux/slices/roller';
import { getUnitImage } from './images';
export { getUnitImage };
interface RaceSymbol {
  race: string;
  symbol: string;
}

export function getSymbolImageByRace(race: string): RaceSymbol {
  let symbol: string = sc;

  switch (race) {
    case 'protoss':
      symbol = protoss;
      break;
    case 'terran':
      symbol = terran;
      break;
    case 'zerg':
      symbol = zerg;
      break;
    default:
      break;
  }

  return { race, symbol };
}

export function parseUnitName(unitName: string): string {
  const words: string[] = unitName.split('_');
  const capitalizedWords: string[] = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  const parsedName: string = capitalizedWords.join(' ');
  return parsedName;
}

export function getUnitTypeDisplayName(type: UnitTypes) {
  const unitTypeDisplayNameMap = {
    core: 'core',
    harass: 'harass',
    caster: 'caster',
    gnd_mass: 'ground massive',
    air_support: 'air support',
    devastator: 'devastator',
    air_mass: 'air massive',
    unknown: 'unknown',
  };

  function capitalizeWords(type: string) {
    return type
      .split(' ')
      .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
      .join(' ');
  }

  const displayName = capitalizeWords(unitTypeDisplayNameMap[type]);
  return displayName;
}

export function getRandomInt(max: number, min: number) {
  return Math.floor(Math.random() * Math.floor(max));
}
