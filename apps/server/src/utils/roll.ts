import { IUnit } from '../models/Unit';

function rollRace(): string {
  const races = shuffleArray(['protoss', 'zerg', 'terran']);
  const randomIndex = Math.floor(Math.random() * races.length);
  return races[randomIndex];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function rollUnit(units: IUnit[], previousUnits: string[]): IUnit {
  if (!units || units.length === 0) {
    return null;
  }

  if (!previousUnits?.length) {
    return rollCoreUnit(units);
  }

  const availableUnits = units.filter(
    (unit) => !previousUnits.includes(unit.name)
  );
  if (availableUnits.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableUnits.length);
    return availableUnits[randomIndex];
  }

  return null;
}

export function rollCoreUnit(units: IUnit[]): IUnit {
  if (!units || units.length === 0) {
    return null;
  }

  const coreUnits = units.filter((unit) => unit.type === 'core');
  return coreUnits[Math.floor(Math.random() * coreUnits.length)];
}

export function performRoll(
  playerName: string,
  units: IUnit[],
  unavailableUnits?: string[]
): { name: string; race: string; units: IUnit[] } {
  const race = rollRace();
  const unitsByRace = units.filter((unit) => unit.race === race);
  const ROLL_COUNT = 4;
  unavailableUnits = unavailableUnits || [];

  const rolledUnits = Array.from({ length: ROLL_COUNT }, () => {
    const roll = rollUnit(unitsByRace, unavailableUnits);
    unavailableUnits.push(roll.name);
    return roll;
  });

  const playerRoll = {
    name: playerName,
    race,
    units: [...rolledUnits],
  };

  return playerRoll;
}
