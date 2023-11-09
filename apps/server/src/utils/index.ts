// TODO: read this from the database
import { units } from '../data';

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface Player {
    name: string;
    race: string;
    units: string[];
}

export function roll(name: string | undefined): Player {
    // Randomly select a race
    const races: string[] = ['zerg', 'terran', 'protoss'];
    const randomRace: string = races[Math.floor(Math.random() * races.length)];

    // Filter units by random race
    const filteredByRandomRace = units.filter((unit) => unit.race === randomRace);

    // Generate the unit tiers
    const tier1: string = filteredByRandomRace[getRandomNumber(0, 4)].name;
    const tier2: string = filteredByRandomRace[getRandomNumber(5, 9)].name;
    const tier3: string = filteredByRandomRace[getRandomNumber(10, filteredByRandomRace.length - 1)].name;

    const player: Player = {
        name: name || '', 
        race: randomRace,
        units: [tier1, tier2, tier3],
    };
    
    console.log("Player Roll Generated: ", player);
    return player;
}
