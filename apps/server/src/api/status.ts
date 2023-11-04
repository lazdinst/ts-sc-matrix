import { Router, Request, Response } from 'express';

const router = Router();

router.get('/status', (req: Request, res: Response) => {
  const serverStatus = {
    connected: true,
  };

  res.json(serverStatus);
});

export default router;
