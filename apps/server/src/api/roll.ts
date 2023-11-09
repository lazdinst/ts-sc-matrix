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
    res.status(500).json({ error: 'Failed to retrieve rolls from the database' });
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

export default router;
