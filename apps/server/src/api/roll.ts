import express, { Router } from 'express';
import { getIO } from '../socket';
const router: Router = express.Router();

import { roll } from '../utils'; // Adjust the path to the 'roll' module
import GameRoll from '../models/GameRoll'; // Adjust the path to the 'GameRoll' model

router.get('/', async (req, res) => {
  console.log('Retrieving rolls. [GET api/roll]');
  try {
    const rolls = await GameRoll.find();
    res.json(rolls); // Return all rolls
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve rolls from the database' });
  }
});

router.post('/', async (req, res) => {
  console.log('Executing a new roll. [POST api/roll]');
  const playerOne = roll('playerOne');
  const playerTwo = roll('playerTwo');

  try {
    await GameRoll.deleteMany({});
    // Create and save the new game roll to MongoDB
    const gameRoll = new GameRoll({
      players: [playerOne, playerTwo],
    });
    const savedRoll = await gameRoll.save();
    const io = getIO();
    io.emit('roll', [playerOne, playerTwo]);

    res.json([playerOne, playerTwo]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save roll to the database' });
  }
});

export default router;
