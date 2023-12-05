import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

import Unit from '../models/Unit'; // Import the Unit model
import { units } from '../data'; // Import your unit data

router.get('/', async (req: Request, res: Response) => {
  try {
    const units = await Unit.find();
    res.json(units);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve units' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    // Delete all current units
    await Unit.deleteMany({});
    console.log(units);
    // Insert the new units
    const insertedUnits = await Unit.insertMany(units); // Assuming data.units is available
    res.json(insertedUnits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update units' });
  }
});

export default router;
