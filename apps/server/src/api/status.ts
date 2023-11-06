import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  console.log('GET /status')
  const serverStatus = {
    connected: true,
  };

  res.json(serverStatus);
});

export default router;
