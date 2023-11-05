import protoss from '../../assets/images/protoss.png';
import terran from '../../assets/images/terran.png';
import zerg from '../../assets/images/zerg.png';
import sc from '../../assets/images/sc.png';

interface RaceSymbol {
  race: string;
  symbol: string;
}

export function getSymbolImageByRace(race: string): RaceSymbol {
  let symbol: string = sc;
  
  switch (race) {
    case "protoss":
      symbol = protoss;
      break;
    case "terran":
      symbol = terran;
      break;
    case "zerg":
      symbol = zerg;
      break;
    default:
      break;
  }

  return { race, symbol };
}
