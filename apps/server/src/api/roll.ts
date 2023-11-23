import express, { Router } from 'express';
import { getIO } from '../socket';
const router: Router = express.Router();
import Unit from '../models/Unit';

import { performRoll } from '../utils/roll';

import GameRoll from '../models/GameRoll';

router.get('/', async (req, res) => {
  console.log('Retrieving rolls. [GET api/roll]');
  try {
    const rolls = await GameRoll.find();
    res.json(rolls);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: 'Failed to retrieve rolls from the database' });
  }
});

router.post('/', async (req, res) => {
  console.log('Executing a new roll. [POST api/roll]');
  const units = await Unit.find();
  const playerOne = performRoll('playerOne', units);
  const playerTwo = performRoll('playerTwo', units);

  console.log('Player One Roll:', playerOne);
  console.log('Player Two Roll:', playerTwo);

  try {
    const io = getIO();
    io.emit('roll', [playerOne, playerTwo]);

    res.json([playerOne, playerTwo]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save roll to the database' });
  }
});

router.put('/', async (req, res) => {
  console.log('Executing a new roll. [POST api/roll]');
  const units = await Unit.find();
  const roll = req.body.roll;
  const ids = req.body.ids;
  const indexes = req.body.indexes;

  const unavailableUnits = roll.units
    .map((unit) => unit.name)
    .filter((unitName) => !ids.includes(unitName));

  for (let i = 0; i < indexes.length; i++) {
    const currentUnit = roll.units[indexes[i]];
    const isCoreUnit = currentUnit.type === 'core';

    if (i === 0 && isCoreUnit) {
      roll.units[indexes[i]] = performRoll(roll.name, units);
    } else {
      roll.units[indexes[i]] = performRoll(roll.name, units, unavailableUnits);
    }
  }

  try {
    const io = getIO();
    io.emit('player-roll', { [roll.name]: roll });

    res.json([roll]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save roll to the database' });
  }
});

export default router;
